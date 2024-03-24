class Cell {
    private position: position;
    public value: number;
    private optionList: Set<number> | null;

    constructor(row: number, col: number, value: number = 0){
        const box = {row: Math.floor(row / 3), col: Math.floor(col / 3)};
        this.position = {row, col, box};
        this.value = value;
        this.optionList = null;
    }

    public get type(): "inProcess" | "number" {
        return this.value === 0 ? "inProcess" : "number";
    }

    public get options(): number[] | null {
        return this.optionList ? Array.from(this.optionList) : null;
    }

    public set options(options: number[] | null | Set<number>) {
        this.optionList = options ? new Set<number>(options) : null;
    }

    public addOption(option: number): void {
        if (this.optionList) {
            this.optionList.add(option);
        } else {
            this.optionList = new Set<number>([option]);
        }
    }

    public get pos(): position {
        return {...this.position};
    }

    public get row(): number {
        return this.position.row;
    }

    public get col(): number {
        return this.position.col;
    }

    public get box(): box {
        return {...this.position.box};
    }
}

export default Cell;