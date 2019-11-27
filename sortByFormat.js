const colorValues = ["trash", "rgb(17, 223, 207)", undefined, null, "#78CBB4", "#4FB79D", "hsl(166, 53%, 41%)", "#1B9077", "#0C7C66", "hsl(357, 68%, 58%)", "hsl(357, 61%, 51%)", "#BE2A31", "#A41E25", "#7F131A", "#500B10", "#D8814F", "rgb(83,104,114)", "rgb(54,69,79)", "rgb(178,216,216)", "rgb(0,76,76)", "hsl(22, 57%, 50%)", "#3E1F01", "hsl(38, 34%, 92%)", "rgb(217, 179, 72)", "#C49D21", "hsl(47, 100%, 28%)", "#5C4A00", "hsl(48, 100%, 5%)", "rgb(24, 235, 169)", "#99D971", "hsl(105, 53%, 51%)", "rgb(128, 43, 30)"];


const splitColors = (color) => {
  const isHEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const isRGB = /^rgb\((\d+),(\d+),(\d+)\)$/;
  const isHSL = /^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/;

  color = color.replace(/\s*/g, ""); // remove spaces

  // label color format and split values into arrays
  let [format, ...values] =
  (isHEX.test(color)) ? ["HEX", isHEX.exec(color)] :
  (isRGB.test(color)) ? ["RGB", isRGB.exec(color)] :
  (isHSL.test(color)) ? ["HSL", isHSL.exec(color)] : [undefined, ""];

  if (format !== undefined) {
    values = values[0].slice(1);

    if (format !== "HEX")
      values = values.map((val) => Number(val));
    else {
      values = `0x${values.join("")}`;
      values = [(values >> 16) & 255, (values >> 8) & 255, values & 255];
    }
    return { format, values };
  }
}


const sortArrays = (values) => {
  let [column_0, column_1, column_2, newArray] = [[], [], [], []];

  values.forEach(([c0, c1, c2] = item) => {
    column_0.push(c0);
    column_1.push(c1);
    column_2.push(c2);
  });

  column_0 = new Set(column_0.sort((a, b) => a - b));
  column_1 = new Set(column_1.sort((a, b) => a - b));
  column_2 = new Set(column_2.sort((a, b) => a - b));

  column_0.forEach(item0 => {
    const f0 = values.filter(value => value[0] === item0);
    column_1.forEach(item1 => {
      const f1 = f0.filter(value => value[1] === item1);
      column_2.forEach(item2 => {
        const f2 = f1.filter(value => value[2] === item2);
        if (f2.length > 0) newArray.push(f2[0]);
      });
    });
  });

  return newArray;
}


const formatResults = (obj) => {
  const results = [];

  obj.hex.forEach(([r, g, b] = values) => {
    [r, g, b] = [r, g, b].map((n) => parseInt(n, 10).toString(16));
    [r, g, b] = [r, g, b].map((n) => n.length === 1 ? `0${n}` : n);
    results.push(`#${r}${g}${b}` /**/ .toUpperCase() /**/ );
  });

  obj.rgb.forEach(([r, g, b] = values) =>
    results.push(`rgb(${r}, ${g}, ${b})`));

  obj.hsl.forEach(([h, s, l] = values) =>
    results.push(`hsl(${h}, ${s}%, ${l}%)`));

  return results;
}


const sortAll = (colors) => {
  const colorObjs = { hex: [], rgb: [], hsl: [] };

  colors = colors.filter(v => !!v).map(item => splitColors(item));

  colors.filter(v => !!v).forEach(obj => {
    if (obj.format != undefined)
      (obj.format === "HEX") ? colorObjs.hex.push(obj.values) :
      (obj.format === "RGB") ? colorObjs.rgb.push(obj.values) :
      (obj.format === "HSL") ? colorObjs.hsl.push(obj.values) : "";
  });

  colorObjs.hex = sortArrays(colorObjs.hex);
  colorObjs.rgb = sortArrays(colorObjs.rgb);
  colorObjs.hsl = sortArrays(colorObjs.hsl);

  return formatResults(colorObjs);
}


console.log(sortAll(colorValues));

/*
[ '#0C7C66',
  '#1B9077',
  '#3E1F01',
  '#4FB79D',
  '#500B10',
  '#5C4A00',
  '#78CBB4',
  '#7F131A',
  '#99D971',
  '#A41E25',
  '#BE2A31',
  '#C49D21',
  '#D8814F',
  'rgb(0, 76, 76)',
  'rgb(17, 223, 207)',
  'rgb(24, 235, 169)',
  'rgb(54, 69, 79)',
  'rgb(83, 104, 114)',
  'rgb(128, 43, 30)',
  'rgb(178, 216, 216)',
  'rgb(217, 179, 72)',
  'hsl(22, 57%, 50%)',
  'hsl(38, 34%, 92%)',
  'hsl(47, 100%, 28%)',
  'hsl(48, 100%, 5%)',
  'hsl(105, 53%, 51%)',
  'hsl(166, 53%, 41%)',
  'hsl(357, 61%, 51%)',
  'hsl(357, 68%, 58%)' ]
*/



//