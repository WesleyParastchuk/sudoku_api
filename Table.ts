import Cell from "./Cell.js";

class Table {
	private static readonly nineNums: number[] = Array.from(
		{ length: 9 },
		(_, i) => i + 1
	);
	private table: Cell[][] = [];

	constructor() {
		this.createFullTable();
	}

	//Inserção

	private putRandom({ row, col }: position): void {
		const cell = this.table[row][col];
		const options = cell.options;

		if (options) {
			const optionsArray = Array.from(options);
			const randomIndex = Math.floor(Math.random() * options.size);
			cell.value = optionsArray[randomIndex];
			cell.options = null;
			this.actualizeOptions({ row, col, box: cell.box });
		}
	}

	private getNextPositions(): position[] {
		let minorSize: number = 9;
		let nextPos: position[] = [];

		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const cell = this.table[row][col];
				if (cell.isEmpty) {
					const optionsSize = cell.options!.size;
					if (optionsSize === 1 && minorSize === 1) {
						nextPos.push({ row, col, box: cell.box });
					} else if (optionsSize < minorSize) {
						nextPos = [{ row, col, box: cell.box }];
						minorSize = optionsSize;
					}
				}
			}
		}

		return nextPos;
	}

	//Preenchimento

	private createBaseTable(): void {
		this.emptyFill();
		this.mainDiagonalFill();
		this.setInitialOptions();
	}

	private emptyFill(): void {
		this.table = Array.from({ length: 9 }, (_, row) =>
			Array.from({ length: 9 }, (_, col) => new Cell(row, col))
		);
	}

	private mainDiagonalFill(): void {
		for (let box = 0; box < 3; box++) {
			const shuffledNumbers = [...Table.nineNums].sort(
				() => Math.random() - 0.5
			);
			for (let row = 0; row < 3; row++) {
				for (let col = 0; col < 3; col++) {
					const tableRow = row + box * 3;
					const tableCol = col + box * 3;
					const numberIndexInArray = row * 3 + col;

					this.table[tableRow][tableCol].value =
						shuffledNumbers[numberIndexInArray];
				}
			}
		}
	}

	private createFullTable(): void {
		this.createBaseTable();
		while (!this.isComplete) {
			const nextPositions = this.getNextPositions();
			if (nextPositions.length > 0) {
				nextPositions.forEach((pos: position) => {
					this.putRandom(pos);
				});
			}
		}
		if (!this.isReady) this.createFullTable();
	}

	//Opções

	private setInitialOptions(): void {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				this.setOption({ row: row, col: col });
			}
		}
	}

	private actualizeOptions(pos: position): void {
		const cells = [
			...this.getRow(pos.row),
			...this.getCol(pos.col),
			...this.getBox(pos.box),
		];

		for (let cell of cells) {
			if (cell.pos !== pos) {
				this.setOption(cell.pos);
			}
		}
	}

	private setOption({ row, col }: rowAndCol): void {
		const cell = this.table[row][col];

		if (cell.isEmpty) {
			const numsToExclude = new Set<number>([
				...this.getRowValues(row),
				...this.getColValues(col),
				...this.getBoxValues(cell.box),
			]);
			numsToExclude.delete(0);

			cell.options = cell.options || new Set<number>(Table.nineNums);

			numsToExclude.forEach(num => cell.options!.delete(num));
		}
	}

	//Validação

	private get isReady(): boolean {
		return !this.table.some(row =>
			row.some(cell => cell.value === undefined)
		);
	}

	private get isComplete(): boolean {
		return !this.table.some(row => row.some(cell => cell.isEmpty));
	}

	//Apresentação

	public get values(): number[][] {
		return this.table.map(row => row.map(cell => cell.value));
	}

	//Get's da tabela
	private getRow(row: number): Cell[] {
		return this.table[row];
	}

	private getRowValues(row: number): number[] {
		return this.getRow(row).map(cell => cell.value);
	}

	private getCol(col: number): Cell[] {
		return this.table.map(row => row[col]);
	}

	private getColValues(col: number): number[] {
		return this.getCol(col).map(cell => cell.value);
	}

	private getBox(box: box): Cell[] {
		return this.table
			.map(row =>
				row.filter(
					cell => cell.box.row === box.row && cell.box.col === box.col
				)
			)
			.flat();
	}

	private getBoxValues(box: box): number[] {
		return this.getBox(box).map(cell => cell.value);
	}
}

export default Table;
