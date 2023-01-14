const { createApp } = Vue;

function random (max) {
	return Math.floor(Math.random()*max);
}
var app = createApp({
	data() {
		return {
			grid: [],
			score: 0,
			high_score: 0
		};
	},
	methods: {
		add_score (val) {
			this.score += val;
			if (this.high_score < this.score) {
				this.high_score = this.score;
			}
		},
		cell_class (i, j) {
			return "cell cell"+this.grid[i][j];
		},
		new_game () {
			this.grid = [	[0, 0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0] ];
			this.max = this.grid.length-1; // the max row / column index
			this.random_cell();
			this.random_cell();
			this.score = 0;
		},
		left () {
			let changed = 0;
			for (let i in this.grid) {
				changed += this.x_merge(i, -1) + this.x_shift(i, -1);
			}
			if (changed) { this.random_cell(); }
		},
		right () {
			let changed = 0;
			for (let i in this.grid) {
				changed += this.x_merge(i, 1) + this.x_shift(i, 1);
			}
			if (changed) { this.random_cell(); }
		},
		up () {
			let changed = 0;
			for (let j in this.grid[0]) {
				changed += this.y_merge(j, -1) + this.y_shift(j, -1);
			}
			if (changed) { this.random_cell(); }
		},
		down () {
			let changed = 0;
			for (let j in this.grid[0]) {
				changed += this.y_merge(j, 1) + this.y_shift(j, 1);
			}
			if (changed) { this.random_cell(); }
		},
		random_cell () {
			let rows = this.grid.length;
			let cols = this.grid[0].length;
			let i = random(rows);
			let j = random(cols);
			let i0 = i, j0 = j;
			do {
				if  (this.grid[i][j] < 1) {
					this.grid[i][j] = (Math.floor(Math.random()*1.2)+1)*2;
					return;
				}
				if (++j >= cols) {
					j = 0;
					if (++i >= rows) {
						i = 0;
					}
				}
			} while (i != i0 || j != j0);
			// Game over
			window.alert("Game over!");
		},
		row_class (i) {
			return i<3 ? "row" : "row row4";
		},
		x_merge (i, delta) {
			let changed = 0;
			let max = (delta < 0) ? 0 : this.max;
			for (let j = max-delta; j >= 0 && j <= this.max; j -= delta) {
				let val = this.grid[i][max];
				let cell = this.grid[i][j];
				if (cell > 0) {
					if (cell == val) {
						this.grid[i][max] += val;
						this.grid[i][j] = 0;
						this.add_score(val);
						changed++;
						j -= delta;
					}
					max = j;
				}
			}
			return changed;
		},
		x_shift (i, delta) {
			let changed = 0;
			let max = (delta < 0) ? 0 : this.max;
			for (let j=max-delta; j >= 0 && j <= this.max; j -= delta) {
				if (this.grid[i][j]) {
					while (this.grid[i][max] > 0 && max*delta > j*delta) {
						max -= delta; // skip over all empty cells
					}
					if (max*delta > j*delta) {
						this.grid[i][max] = this.grid[i][j];
						this.grid[i][j] = 0;
						changed++;
					}
					max -= delta;
				}
			}
			return changed;
		},
		y_merge (j, delta) {
			let changed = 0;
			let max = (delta < 0) ? 0 : this.max;
			for (let i = max-delta; i >= 0 && i <= this.max; i -= delta) {
				let val = this.grid[max][j];
				let cell = this.grid[i][j];
				if (cell > 0) {
					if (cell == val) {
						this.grid[max][j] += val;
						this.grid[i][j] = 0;
						this.add_score(val);
						changed++;
						i -= delta;
					}
					max = i;
				}
			}
			return changed;
		},
		y_shift (j, delta) {
			// Move columns to the left-most possible spot:
			let changed = 0;
			let max = (delta < 0) ? 0 : this.max;
			for (let i = max-delta; i >= 0 && i <= this.max; i -= delta) {
				if (this.grid[i][j]) {
					while (this.grid[max][j] > 0 && max*delta > i*delta) {
						max -= delta; // skip over all empty cells
					}
					if (max*delta > i*delta) {
						this.grid[max][j] = this.grid[i][j];
						this.grid[i][j] = 0;
						changed++;
					}
					max -= delta;
				}
			}
			return changed;
		},
		unmount () {
			localStorage.setItem('game2048_high_score', this.high_score);
		}
	},
	mounted() {
		this.$refs.game.focus();
		this.high_score = localStorage.getItem('game2048_high_score');
		this.new_game();
		window.addEventListener("beforeunload",	this.unmount);
	}
});
app.mount('#app');
