class Cell{
	private position: position;
	public value: number;
	private optionList: Set<number> | null;

	constructor(row: number, col: number, value: number = 0) {
		const box = { row: Math.floor(row / 3), col: Math.floor(col / 3) };
		this.position = { row, col, box };
		this.value = value;
		this.optionList = null;
	}

    public get isEmpty(): boolean {
        return this.value === 0;
    }

	public get options(): Set<number> | null {
		return this.optionList ? this.optionList : null;
	}

	public set options(options: number[] | null | Set<number>) {
		this.optionList = options ? new Set<number>(options) : null;
	}

	public get pos(): position {
		return { ...this.position };
	}

	public get row(): number {
		return this.position.row;
	}

	public get col(): number {
		return this.position.col;
	}

	public get box(): box {
		return { ...this.position.box };
	}
}

export default Cell;
