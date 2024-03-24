type row = number;
type column = number;

type box = { row: row; col: column };
type rowAndCol = { row: row; col: row };

type position = rowAndCol & { box: box };

type tableArray = number[][];