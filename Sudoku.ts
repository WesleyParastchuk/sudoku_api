import Table from "./Table";
class Sudoku {
    private game: tableArray;
	constructor() {
		this.game = new Table().values;
	}

    public get table(): tableArray {
        return this.game;
    }
}

const table = new Sudoku();

console.table(table.table);
