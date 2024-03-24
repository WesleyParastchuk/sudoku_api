import Cell from "./Cell.js";

class Table {
	private static readonly nineNums: number[] = Array.from(
		{ length: 9 },
		(_, i) => i + 1
	);
	private table: Cell[][] = [];
	private firstEmpty: position | null = {
		row: 0,
		col: 3,
		box: { row: 0, col: 1 },
	};

	constructor() {
		this.emptyFill();
		this.diagonalFill();
		this.setInitialOptions();
		this.setOptions();

		while (!this.isComplete && this.firstEmpty) {
			while (this.putAllWithOneOption()) {
				console.table(this.values());
				this.setOptions();
			}
			if (this.firstEmpty) this.putFirstRandom();
		}
	}

	private putAllWithOneOption() {
		let hasOneOption = false;
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (
					this.table[row][col].type === "inProcess" &&
					this.table[row][col].options &&
					this.table[row][col].options!.length === 1
				) {
					this.table[row][col].value =
						this.table[row][col].options![0];
					this.table[row][col].options = null;
					hasOneOption = true;
					if (
						this.firstEmpty &&
						this.firstEmpty.row === row &&
						this.firstEmpty.col === col
					) {
						this.nextEmpty();
					}
				}
			}
		}
		return hasOneOption;
	}

	private setInitialOptions() {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.table[row][col].type === "inProcess") {
					const numbers = new Set([
						...this.rowValue(row),
						...this.colValue(col),
						...this.boxValue(this.table[row][col].box),
					]);
					numbers.delete(0);
					this.table[row][col].options = new Set<number>();
					for (let search = 0; search < 9; search++) {
						if (!numbers.has(search + 1)) {
							this.table[row][col].addOption(search + 1);
						}
					}
				}
			}
		}
	}


	private actualizeOptions(pos:position){
		const {row, col, box} = pos;
		const numbers = new Set([
			...this.rowValue(row),
			...this.colValue(col),
			...this.boxValue(box),
		]);
		numbers.delete(0);
		this.table[row][col].options = new Set<number>();
		for (let search = 0; search < 9; search++) {
			if (!numbers.has(search + 1)) {
				this.table[row][col].addOption(search + 1);
			}
		}
	
	}


	private setOptions() {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.table[row][col].type === "inProcess") {
					const numbers = new Set([
						...this.rowValue(row),
						...this.colValue(col),
						...this.boxValue(this.table[row][col].box),
					]);
					numbers.delete(0);
					this.table[row][col].options = new Set<number>();
					for (let search = 0; search < 9; search++) {
						if (!numbers.has(search + 1)) {
							this.table[row][col].addOption(search + 1);
						}
					}
				}
			}
		}
	}

	private putFirstRandom() {
		if (
			this.firstEmpty &&
			this.table[this.firstEmpty.row][this.firstEmpty.col].options
		) {
			this.table[this.firstEmpty.row][this.firstEmpty.col].value =
				this.table[this.firstEmpty.row][this.firstEmpty.col].options![
					Math.floor(
						Math.random() *
							this.table[this.firstEmpty.row][this.firstEmpty.col]
								.options?.length!
					)
				];
			this.table[this.firstEmpty.row][this.firstEmpty.col].options = null;
			this.nextEmpty();
		}
	}

	private rowValue(row: number): number[] {
		return this.table[row].map(cell => cell.value);
	}

	private colValue(col: number): number[] {
		return this.table.map(row => row[col].value);
	}

	public boxValue(box: box): number[] {
		return this.table
			.map(row =>
				row
					.filter(
						cell =>
							cell.box.row === box.row && cell.box.col === box.col
					)
					.map(cell => cell.value)
			)
			.flat();
	}

	private diagonalFill(): void {
		for (let boxIndex = 0; boxIndex < 3; boxIndex++) {
			const shuffledNumbers = [...Table.nineNums].sort(
				() => Math.random() - 0.5
			);
			for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
				for (let colIndex = 0; colIndex < 3; colIndex++) {
					const tableRow = rowIndex + boxIndex * 3;
					const tableCol = colIndex + boxIndex * 3;
					const numberIndex = rowIndex * 3 + colIndex;

					this.table[tableRow][tableCol].value =
						shuffledNumbers[numberIndex];
				}
			}
		}
	}

	private emptyFill(): void {
		this.table = Array(9)
			.fill(null)
			.map((_, row) =>
				Array(9)
					.fill(null)
					.map((_, col) => new Cell(row, col))
			);
	}

	public get tableData(): Cell[][] {
		return this.table;
	}

	public values(): any {
		return this.table.map(row =>
			row.map(cell => (cell.value ? cell.value : cell.options))
		);
	}

	public get isComplete() {
		return this.table.every(row => row.every(cell => cell.value !== 0));
	}

	private nextEmpty(): position | null {
		if (this.firstEmpty === null) {
			return this.firstEmpty;
		}

		const cellInProcess = this.table
			.flatMap(row => row)
			.find(
				cell =>
					cell.type === "inProcess" &&
					cell.pos.row * 9 + cell.pos.col >
						this.firstEmpty!.row * 9 + this.firstEmpty!.col
			);

		if (cellInProcess) {
			this.firstEmpty = cellInProcess.pos;
		} else {
			this.firstEmpty = null;
		}

		return this.firstEmpty;
	}

	public nextEmpty2(): position | null {
		let cellInProcess = null;

		for (let row of this.table) {
			cellInProcess = row.find(
				cell =>
					cell.type === "inProcess" &&
					cell.pos.row * 9 + cell.pos.col >
						this.firstEmpty!.row * 9 + this.firstEmpty!.col
			);
			if (cellInProcess) {
				break;
			}
		}

		if (cellInProcess) {
			this.firstEmpty = cellInProcess.pos;
		} else {
			this.firstEmpty = null;
		}

		return this.firstEmpty;
	}
}

const table = new Table();

console.table(table.values());
console.table(table.tableData);

export default Table;
