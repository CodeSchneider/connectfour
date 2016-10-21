		// global settings
		OFF_BOARD = 2;
		COLS = 7;
		LOOK_AHEAD = 4;
		WIN_SCORE = 9999;

		// global objects
		turn = 0;
    firstMove = true;
    gameId = '';
		currBoard = new Board(COLS,0,new Array(COLS^2));
		scoreArr = new Array();

		// DOM manipulation for GUI
		function buildBoard(size){
			$("#board").append( $("<table id='boardId'>").addClass("boardTable") );
			for (i = 0; i < size; ++i) {
				$(".boardTable").append( $("<tr>").addClass("boardRow") );
				for (j = 0; j < size; ++j) {
					$(".boardRow:last").append( $("<td>").addClass("boardCell").data("column",j)
					.click(function() {
						if(turn==0) {
              if (firstMove) {
                persistNewGame(function(err,game){
                  if (err) {
                    Materialize.toast('Sorry, something went wrong with creating the new game.', 4000);
                  }
                  firstMove = false;
                  gameId = game.id;
                  playColumn(jQuery.data(this,"column"));
                });
              }
              playColumn(jQuery.data(this,"column"));
            }
					}));
				}
			}
		}

		function playColumn(c) {
			if (currBoard.getScore(0) != WIN_SCORE && currBoard.getScore(1) != WIN_SCORE && !currBoard.isFull()) {
				$("#board tr td:nth-child("+(c+1)+"):not(.played):last").addClass("played player"+(turn+1)).data("player",turn);
				currBoard.playColumn(c);

				turn = Math.abs(turn-1);
				if (turn == 1) {
					window.setTimeout('playColumn(minMax(turn,currBoard,LOOK_AHEAD)[0]);', 10);
					// if (LOOK_AHEAD < 5) LOOK_AHEAD++; if you want to get smarter as we go on
					$("#message").html('The computer needs to think...');
				}
				else { $("#message").html('Your turn, fellow human...'); }
			}
			if (currBoard.getScore(0) == WIN_SCORE) {
        $("#message").html('Wow, you won!');
        uploadMove({
          currBoard: currBoard,
          userWon: true
        });
      } else if (currBoard.getScore(1) == WIN_SCORE) {
        $("#message").html('The computer has won, I\'m not suprised.');
        uploadMove({
          currBoard: currBoard,
          computerWon: true
        });
      } else if (currBoard.isFull()) {
        $("#message").html('Welp, the board is full, let\'s call it a tie');
        uploadMove({
          currBoard: currBoard,
          isFull: true
        });
      } else {
        uploadMove({
          currBoard: currBoard
        });
      }
		}

    function uploadMove(payload) {
      var payload = JSON.stringify(payload);
      $.ajax({
        url: "/game/"+gameId+"/addMove",
        type: 'POST',
        contentType:'application/json',
        data: payload,
        dataType:'json',
        success: function(data){
        },
        error: function(data){
        }
      });
    }

    function persistNewGame(cb){
      $.ajax({
        url: '/game/create',
        type: 'POST',
        success: function(resp) {
          return cb(null,resp);
        },
        error: function(err) {
          return cb(err,null);
        }
      });
    }

		function minMax(p, b, d) {
			// p: player designation
			// b: current board state
			// d: iteration depth

			var score = b.getScore(p);
			// some game states do not require any thinking (e.g. already lost or won)
			if (d == 0) return [null,score]; // max depth reached. just return the score.
			if (score == -WIN_SCORE) return [null,score]; // we lose, not good.
			if (score == WIN_SCORE) return [null,score]; // we win, good.
			if (b.isFull()) return [null,8888]; // board is full, pretty good, but not as good as winning.
			// simple optimization attempt. look ahead two moves to see if win or lose possible.
			// this prevents the algorithm from exploring parts of the state space that are unrealistic to occur.
			if (d > 2) {
				for (var q = 0; q < b.size; ++q) { // for each possible move.
					var n = b.clone(); // copy current state.
					if (n.playColumn(q)) { // make move.
						var qs = minMax(p,n,2); // look ahead one move.
						if (qs[1] == WIN_SCORE || qs[1] == -WIN_SCORE)  {
							return [q,qs[1]]; // if I win or lose, stop exploring.
						}
          }
        }
      }

			// algorithm considers best and worst possible moves in one loop to save lines of code.
			var maxv = 0; // best score.
			var maxc = -1; // column where best score occurs.
			var minv = 999999; // worst score.
			var minc = -1; // colum where worst score occurs.
			for (var q = 0; q < b.size; ++q) { // for each possible move.
				var n = b.clone(); // copy current state.
				if (n.playColumn(q)) { // make move.
					var next = minMax(p,n,d-1); // look ahead d-1 moves.
					if (maxc == -1 || next[1] > maxv) { maxc = q; maxv = next[1]; } // compare to previous best.
					if (minc == -1 || next[1] < minv) { minc = q; minv = next[1]; } // compare to previous worst.
				}}
			if (b.turn==p) { // if it is our turn.
				return [maxc,maxv/2+score/2]; // make best possible move.
			} else { // otherwise.
				return [minc,minv/2+score/2]; // make worst possible move.
			}
		}

		// Board object used to store game states
		function Board(size, turn, state)
		{
			this.size = size;
			this.turn = turn;
			this.state = state;
		}
		Board.prototype.getHash = function() { return this.state.toString(); }
		Board.prototype.playColumn = function(c)
		{
			if (this.getCell(0,c) == null) {
				var i = this.size - 1;
				while (this.getCell(i,c) != null) {
					i--;
				}
				this.state[i*this.size+c] = this.turn;

				this.turn = Math.abs(this.turn-1);
				return true;
			} else { return false; }
		};

		Board.prototype.getCell = function(r,c) {
			if (r >= 0 && c >= 0 && r < this.size && c < this.size) {
				try { return (this.state[r*this.size+c]); } catch(err) { return null; }
			} else { return OFF_BOARD; }
		};

		Board.prototype.getScore = function(p) {
			if (scoreArr[''+p+this.getHash()]!=null) {
				return scoreArr[''+p+this.getHash()];
			} else {
				var score = 0;
				for (i = 0; i < this.size; ++i) {
					for (j = 0; j < this.size - 4 + 1; ++j) {
						var line = new Array(6);
						for (k = 0; k < 6; ++k) { line[k]=[0,0,0]; }
						for (n = j; n < j + 4; ++n) {
							line[0][this.getCell(n,i)]++; // columns
							line[1][this.getCell(i,n)]++; // rows
							line[2][this.getCell(n,n-i)]++; // diagonal southwest half
							line[3][this.getCell(this.size-n-1,n-i)]++; // diagonal northwest half
							if (i>0) {
								line[4][this.getCell(n-i,n)]++; // diagonal northweast half
								line[5][this.getCell(n+i,this.size-n-1)]++; // diagonal southeast half
							}
						}
						for (k = 0; k < 6; ++k) {
							if (line[k][p]==4) return WIN_SCORE; // win
							if (line[k][Math.abs(p-1)]==4) return -WIN_SCORE; // lose
							if (line[k][Math.abs(p-1)]==0 && line[k][OFF_BOARD]==0) { score += Math.pow(line[k][p],2); }
						}
					}
				}

				scoreArr[''+p+this.getHash()] = score;
				return score;
			}
		};

		Board.prototype.isFull = function() {
			for (var n = 0; n < this.size^2; ++n) {
				if (this.state[n]==null) { return false; }
			}
			return true;
		};

		Board.prototype.clone = function() {
			return new Board(this.size, this.turn, this.state.slice(0));
		};

		$(document).ready(function() {
			buildBoard(COLS);

			// jQuery + CCS magic for highlighting target column
			$("#boardId").delegate('td','mouseover mouseleave', function(e) {
				if (e.type == 'mouseover' && turn == 0) {
					$("#board tr td:nth-child("+($(this).index()+1)+"):not(.played)").addClass("hover");
					$("#board tr td:nth-child("+($(this).index()+1)+"):not(.played):last").addClass("hover-target");
				}
				else {
					$("#board tr td:nth-child("+($(this).index()+1)+"):not(.played)").removeClass("hover");
					$("#board tr td:nth-child("+($(this).index()+1)+"):not(.played):last").removeClass("hover-target");
				}
			});

      $('#new-game-button').click(function(e){
        currBoard = new Board(COLS,0,new Array(COLS^2));
        scoreArr = new Array();
        firstMove = true;
        $("#board tr td").removeClass("played player1 player2 hover hover-target");
        var difficulty = $('input[name=diff]:checked').val();
        if (difficulty == 'easy') {
          LOOK_AHEAD = 2;
        } else {
          LOOK_AHEAD = 4;
        }
      });
		});
