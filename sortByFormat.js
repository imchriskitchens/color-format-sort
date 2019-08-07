const colorValues = ["rgb(17, 223, 207)", "#78CBB4", "#4FB79D", "hsl(166, 53%, 41%)", "#1B9077", "#0C7C66", "hsl(357, 68%, 58%)", "hsl(357, 61%, 51%)", "#BE2A31", "#A41E25", "#7F131A", "#500B10", "#D8814F", "rgb(83,104,114)", "rgb(54,69,79)", "rgb(178,216,216)", "rgb(0,76,76)", "hsl(22, 57%, 50%)", "#3E1F01", "hsl(38, 34%, 92%)", "rgb(217, 179, 72)", "#C49D21", "hsl(47, 100%, 28%)", "#5C4A00", "hsl(48, 100%, 5%)", "rgb(24, 235, 169)", "#99D971", "hsl(105, 53%, 51%)", "rgb(128, 43, 30)"];


const splitColors = (color) => {
  const isHEX = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i;
  const isRGB = /^(rgb)\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
  const isHSL = /^(hsl)\((\s*\d{1,3}\s*),(\s*\d{1,3}%\s*),(\s*\d{1,3}%\s*)\)$/;

  let [format, ...values] = (isHEX.test(color)) ? ["HEX", isHEX.exec(color)] :
  (isRGB.test(color)) ? ["RGB", isRGB.exec(color)] :
  (isHSL.test(color)) ? ["HSL", isHSL.exec(color)] : '';

  // remove irrelevant data
  values = (format === "HEX") ? values[0].slice(1) : values[0].slice(2);

  // strip (%) from HSL data
  if (format === "HSL") {
    const hslVals = /(\s*\d{1,3}\s*),\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*/;
    values = (hslVals.exec(values)).slice(1);
  }

  // create array of number values from string values (RGB & HSL)
  if (format !== "HEX") {
    values = values.map(val => Number(val));
  } else {
    // convert hexadecimal values to decimal (radix)
    values = `0x${values.join("")}`;
    values = [(values >> 16) & 255, (values >> 8) & 255, values & 255];
  }
  // return as object 
  return { format, values };
}


const sortArrays = (values) => {
  let [column_0, column_1, column_2, newArray] = [[], [], [], []];

  // create array for each column of data and sort values
  values.forEach(item => {
    let [c0, c1, c2] = item;
    column_0.push(c0);
    column_1.push(c1);
    column_2.push(c2);
  });

  column_0 = new Set(column_0.sort((a, b) => a - b));
  column_1 = new Set(column_1.sort((a, b) => a - b));
  column_2 = new Set(column_2.sort((a, b) => a - b));

  // use column values as a lookup, placing each [color array] in correct order
  // .. of [resulting array] containing all colors. (hard to explain)
  column_0.forEach(item0 => {
    const f0 = (values.filter(value => value[0] === item0));
    column_1.forEach(item1 => {
      const f1 = (f0.filter(value => value[1] === item1));
      column_2.forEach(item2 => {
        const f2 = (f1.filter(value => value[2] === item2));
        if (f2.length > 0) newArray.push(f2[0]);
      });
    });
  });
  return newArray;
}


const groupFormats = () => {
  const colorObjs = { hex: [], rgb: [], hsl: [] };
  const { hex, rgb, hsl } = colorObjs;

  colorValues.forEach(item => {
    const sortFormats = (obj) => (obj.format === "HEX") ? hex.push(obj.values) :
      (obj.format === "RGB") ? rgb.push(obj.values) :
      (obj.format === "HSL") ? hsl.push(obj.values) : void 0;
    sortFormats(splitColors(item));
  });

  colorObjs.hex = sortArrays(colorObjs.hex);
  colorObjs.rgb = sortArrays(colorObjs.rgb);
  colorObjs.hsl = sortArrays(colorObjs.hsl);
  return colorObjs;
}


const formatResults = () => {
  const obj = groupFormats();
  const resultArray = [];

  // convert decimal values to hexadecimal (radix)
  // format hex value output
  obj.hex.forEach(value => {
    let [r, g, b] = value;
    r = parseInt(r, 10).toString(16);
    g = parseInt(g, 10).toString(16);
    b = parseInt(b, 10).toString(16);
    r = r.length == 1 ? "0" + r : r;
    g = g.length == 1 ? "0" + g : g;
    b = b.length == 1 ? "0" + b : b;
    resultArray.push((`#${r}${g}${b}`).toUpperCase());
  });

  // format rgb value output
  obj.rgb.forEach(value => {
    const [r, g, b] = value;
    resultArray.push(`rgb(${r}, ${g}, ${b})`);
  });

  // format hsl value output
  obj.hsl.forEach(value => {
    const [h, s, l] = value;
    resultArray.push(`hsl(${h}, ${s}%, ${l}%)`);
  });

  return resultArray;
}

console.log(formatResults());