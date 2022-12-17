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
		cell_class (i, j) {
			return "cell cell"+this.grid[i][j];
		},
		new_game () {
			this.grid = [	[0, 0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0] ];
			this.random_cell();
			this.random_cell();
			score = 0;
		},
		left () {
			this.grid[0][0] = 2048;
			this.grid[1][1] = 2048;
		},
		right () {
			this.grid[0][0] = 4096;
		},
		up () {
			this.grid[0][0] = 8192;
		},
		down () {
			this.grid[0][0] = 16384;
		},
		random_cell () {
			let rows = this.grid.length;
			let cols = this.grid[0].length;
			let i = random(rows);
			let j = random(cols);
			while (this.grid[i][j] > 0) {
				if (++j >= cols) {
					j = 0;
					if (++i >= rows) {
						i = 0;
					}
				}
			}

			this.grid[i][j] = (random(2)+1)*2;
		},
		row_class (i) {
			return i<3 ? "row" : "row row4";
		}
	},
	mounted() {
		this.$refs.game.focus();
		this.new_game();
	}
});
app.mount('#app');
