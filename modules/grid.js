
import Cell from './cell.js';

/**
 * модуль, который описывает игровое поле
 * @module Grid
 *
 */



const parentEl = document.getElementById("playfield");
//константы на setTimeout и анимации FadeIn and FadeOut
/** @const {Number} startButtonFadeOut Время FadeOut кнопки start после её нажатия */
const startButtonFadeOut = 600;

/** @const {Number} scoreBlockFadeIn Время FadeIn score после нажатия кнопки start */
const scoreBlockFadeIn = 2000;

/** @const {Number} accessFlagTimeOut Время setTimeOut для флага в функции swapDirection() который запрещает повторные действия,
 *  пока не закончится анимация*/
const accessFlagTimeOut = 600;

/** @const {Number} celltransition Время setTimeOut для передвижения клетки*/
const celltransition = 200;

/** @const {Number} deletePopClassTimeOut Время setTimeOut для удаления класса анимации pop(соединении двух одиновых клеток) и move-up(анимация разницы в score) */
const deletePopClassTimeOut = 400;

/** @const {Number} addCardTimeOut Время setTimeOut для добавления карты, чтобы было время на выполнение анимаций и просто для более плавной игры */
const addCardTimeOut = 200;

/** @const {Number} gameOverCheackTimeOut Время setTimeOut после добавления карты выполняем функцию  findIsGameOver() */
const gameOverCheackTimeOut = addCardTimeOut + 100;

/** @const {Number} gameScoreFadeOut Время fadeOut на исчезновения score после выйгрыша или пройгрыша */
const gameScoreFadeOut = 1000;

/** @const {Number} animationPhraseTimeOut Время setTimeOut на добавление события кнопки играть ещё раз(появляется при выйгрыше или пройгрыше)
 * если добавить событие сразу то не успеет пройти анимация окна выйгрыша ил пройгрыша
 */
const animationPhraseTimeOut = 2000;





//константы DOM
/** @const {HTMLElement} differenceDOM разница в счёте, необходим для анимации счёта при соединении 2 клеток*/
const differenceDOM = document.querySelector(".difference");

/** @const {HTMLElement} scoreDOM значение score*/
const scoreDOM = document.querySelector('.score');

/** @const {HTMLElement} scoreWinLoseDOM финальный score при выйгрыше или поражении*/
const scoreWinLoseDOM = document.querySelector('.score-win-lose');

/** @const {HTMLElement} gameOverDOM заставка когда выйграл или проиграл*/
const gameOverDOM = document.querySelector(".game-over");

/** @const {HTMLElement} gameScoreDOM надпись score и значениe score для анимации при начале игры и когда проиграл*/
const gameScoreDOM = document.querySelector(".game-score");

/** @const {HTMLElement} startAgainButtonDOM кнопка начать заного при пройгрыше или выйгрыше*/
const startAgainButtonDOM = document.querySelector(".start-again");

/** @const {HTMLElement} winOrLoseTitleDOM надпись при выйгрыше или пройгрыше*/
const winOrLoseTitleDOM = document.querySelector(".win-or-lose-title");

/** @const {HTMLElement} startDOM кнопка игру*/
const startDOM = document.querySelector(".start");

/** Класс представляющий игровое поле */
class Grid {
  /**
   * создать игровое поле
   * @param {number} size  размер квадрата(игрового поля)
  //в данном случае разбил на массивы для 4 направлений, чтобы не дублировать методы move and combine для каждого направления
   * @param {Array} rightDirectionGrid  массив клеток представлен для случая, когда сдвигаем вправо
   * @param {Array} downDirectionGrid  массив клеток представлен для случая, когда сдвигаем вниз
   * @param {Array} leftDirectionGrid  массив клеток представлен для случая, когда сдвигаем влево
   * @param {Array} upDirectionGrid  массив клеток представлен для случая, когда сдвигаем вверх
   * @param {Array} commonArr  массив всех клеток, из него получаем массив свободных клеток, и по нему делаем поиск для удаления классов анимации
   * @param {Array} openCellsArr  массив всех свободных клеток для добавления новых и здесь смотрим кол-во свободных клеток для gameOver
   * @param {Object} mouseDownCoord  координаты точки при нажатой клавише мыши 
   * @param {Object} mouseUpCoord  координаты точки при отпускании клавише мыши 
   * @param {Number} score  текущий счёт, счёт увеличивается когда две клетки соединяются = номиналу получившейся клетки
   * @param {Number} previousScore  счёт до соединения двух клеток, необходим для нахождения разницы с текущим счётом и анимации
   * @param {Number} openSlots  кол-во свободных ячеек необходимо
   * @param {boolean} access  флаг для swapDirection() исключает повторное выполнение действия, пока не закончилась анимация 
   * @param {boolean} mousedown  флаг для отображения нажата кнопка мыши или нет
   * @param {boolean} flagWinOrLose  флаг для отображения игра выйграна или проиграна, исключает выполнение каких-либой действий
   * @param {boolean} isWin  флаг для отображения что игра выйграна, добавляем новую карту или нет, появлении анимации выйгрыша
   * @param {boolean} hasMove  флаг для отображения что было совершено действие движения или соединения карт, добавляем или нет новую карту isGameOver
   * @param {boolean} isGameOver  флаг для отображения что игра проиграна, анимация игра проиграна
   * @param {object} beginButtonEvent()  вызываем данный метод при создании игрового поля
   */
  constructor(size = 4) {
    this.size = size;
    this.rightDirectionGrid = [];
    this.downDirectionGrid = []
    this.leftDirectionGrid = [];
    this.upDirectionGrid = [];
    this.commonArr = [];
    this.openCellsArr = [];
    this.mouseDownCoord = {};
    this.mouseUpCoord = {};
    this.cellsForMoving = [];
    this.score = 0;
    this.previousScore = 0;
    this.openSlots = null;
    this.access = true;
    this.mousedown = false;
    this.flagWinOrLose = false;
    this.isWin = false;
    this.hasMove = false;
    this.isGameOver = false;
    this.beginButtonEvent();
  }

  /**
   * создает клетки, заполняет массивы
   * @return {Array} возвращает массив с подмассивом для каждого из 4 направлений и 1 общий массив 
  */
  build() {
    for (let y = 0; y < this.size; y++) {
      let rowOx = (this.rightDirectionGrid[y] = []);
      for (let x = 0; x < this.size; x++) {
        let cell = new Cell(y, x, true, null);
        let cellsForAnimation = new Cell(y, x, true, null);
        rowOx.push(cell);
        this.commonArr.push(cell)
      }
    }
    for (let i = 0; i < this.size; i++) {
      let rowOy = (this.downDirectionGrid[i] = []);
      for (let j = 0; j < this.size; j++) {
        rowOy.push(this.rightDirectionGrid[j][i])
      }
    }
    for (let m = 0; m < this.size; m++) {
      let reverseforLeft = [...this.rightDirectionGrid[m]].reverse();
      let reverseforUp = [...this.downDirectionGrid[m]].reverse();
      this.leftDirectionGrid.push(reverseforLeft);
      this.upDirectionGrid.push(reverseforUp);
    }
  }

  /**
   * 
   * Инициализирует начало игры, при нажатии на кнопку 'старт', 
   * нажать на кнопку можно, только 1 раз
  */
  beginButtonEvent() {
    startDOM.addEventListener('click', this.letsBegin.bind(this), { once: true });
  }


  /**
    * добавляет события на нажатия и отпускание кнопки
  */
  addMouseUpDownEvent() {
    document.addEventListener('mousedown', this.findCoordinat.bind(this));//при нажатии находим координаты 1 точки 
    document.addEventListener('mouseup', this.swapDirection.bind(this));//находим координаты 2 точки и совершаем действие
  }

  /**
    * запускает игровой процесс
  */
  letsBegin() {
    this.closeHelloFrame()
    this.build();
    this.addCard();
    this.addMouseUpDownEvent();
    $(startDOM).fadeOut(startButtonFadeOut);
  }


  /**
    * выполнение основных действий при определении направления хода
    * @param  {Array} directionGrid массив с клетками выстроенными для определенного направления
  */
  whatToDo(vector) {
    this.findAndDeleteClass('appear'); //находим анимацию появления и удаляем её 
    console.log(0);
    this.move(vector);
    // this.combine(directionGrid)
    // this.move(directionGrid);
    //даёт анимации соединения двух клеток и анимации счёта пройти, затем удаляет их
    // setTimeout(() => {
    //   setTimeout(() => {
    //     this.findAndDeleteClass('pop');
    //     differenceDOM.classList.remove("move-up");
    //   }, deletePopClassTimeOut);
    //   //если было действие и не выйграно добавляем новую карту, если выйграно то анимация выйгрыша
    //   if (this.hasMove && !this.isWin) {
    //     setTimeout(() => {
    //       this.addCard()
    //     }, addCardTimeOut);
    //   } else if (this.isWin) { this.animationWinLose("You Win!"); }
    //   //после добавления карты проверям проиграли или нет, в случае пройгрыша - анимация
    //   setTimeout(() => {
    //     this.findIsGameOver();
    //     if (this.isGameOver) {
    //       this.animationWinLose("Game Over!");
    //     }
    //   }, gameOverCheackTimeOut);
    // }, 500)
    setTimeout(() => {
      console.log(7);

      this.findAndDeleteClass('pop');
      differenceDOM.classList.remove("move-up");
      //если было действие и не выйграно добавляем новую карту, если выйграно то анимация выйгрыша
      if (this.hasMove && !this.isWin) {
        this.addCard()
      } else if (this.isWin) {
        this.animationWinLose("You Win!");
      }
      //после добавления карты проверям проиграли или нет, в случае пройгрыша - анимация
      this.findIsGameOver();
      if (this.isGameOver) {
        this.animationWinLose("Game Over!");
      }
    }, celltransition + 200)

  }


  /**
    * запускаем поиск координат при отпущенной клавише, поиск направления движения, разницу в счёте
  */
  swapDirection(e) {
    this.findCoordinat(e);
    this.previousScore = this.score;
    if (this.access && !this.flagWinOrLose) {
      this.access = false;
      this.findDirection();
      setTimeout(() => {
        this.access = true;
      }, celltransition);
    }
    let difference = this.score - this.previousScore;
    this.refreshScrore();
    differenceDOM.innerHTML = "+" + `${difference}`;
  }

  /**
    * обновляем счёт
  */
  refreshScrore() {
    scoreWinLoseDOM.innerHTML = this.score;
    scoreDOM.innerHTML = this.score;
  }


  /**
    * находим и удаляем класс анимации 
  */
  findAndDeleteClass(classToDelete) {
    this.commonArr.forEach(cell => cell.deleteOneClass(classToDelete));
  }

  /**
    *находим координаты зажатой и отпущенной клавиши мыши
    @return {Object} возвращает объект с координами
  */
  findCoordinat(e) {
    this.mousedown = !this.mousedown; //флаг который устанавливает нажатие и отпускание мыши
    if (event.which == 1 && this.mousedown) {
      this.mouseDownCoord.x = e.clientX;
      this.mouseDownCoord.y = e.clientY;
    } else if (event.which == 1 && !this.mousedown) {
      this.mouseUpCoord.x = e.clientX;
      this.mouseUpCoord.y = e.clientY;
    }
  }


  /**
    *обрабатываем полученный координыта нажатий мыши, и передаём нужный массив в метод действия 
  */
  findDirection() {
    let xVector = this.mouseDownCoord.x > this.mouseUpCoord.x;
    let yVector = this.mouseDownCoord.y > this.mouseUpCoord.y;
    let xDiff = Math.abs(this.mouseDownCoord.x - this.mouseUpCoord.x);
    let yDiff = Math.abs(this.mouseDownCoord.y - this.mouseUpCoord.y);
    if (!xVector && xDiff > yDiff) {
      return this.whatToDo({ x: 1, y: 0 });
    } else if (xVector && xDiff > yDiff) {
      return this.whatToDo({ x: -1, y: 0 });
    } else if (!yVector && yDiff > xDiff) {
      return this.whatToDo({ x: 0, y: 1 });
    } else if (yVector && yDiff > xDiff) {
      return this.whatToDo({ x: 0, y: -1 });
    }
  }

  /**
    *отвечает за движение клеток по игровому полю, если было движение то устанавливает this.hasMove = true;
  */
  move(vector) {
    let direction = vector;
    //минимальные и максимальные значения для цикла
    let minX, maxX, minY, maxY;
    if (direction.x > 0) {
      maxX = this.size - 1;
      minX = 0;
    } else if (direction.x < 0) {
      maxX = this.size;
      minX = 1;
    } else {
      maxX = this.size;
      minX = 0;
    }

    if (direction.y > 0) {
      maxY = this.size - 1;
      minY = 0;
    } else if (direction.y < 0) {
      maxY = this.size;
      minY = 1;
    } else {
      maxY = this.size;
      minY = 0;
    }



    let m = 0;
    while (m < this.size) {
      for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
          let currentCell = this.rightDirectionGrid[y][x];
          let nextCell = this.rightDirectionGrid[y + direction.y][x + direction.x];
          if (!currentCell.isOpen && nextCell.isOpen) {

            currentCell.updateIsOpen(nextCell);
            this.hasMove = true;
          }
          if (currentCell.value === nextCell.value && currentCell.value !== null && nextCell.value !== null && !nextCell.isCombine) {
            currentCell.combineCells(nextCell)
            this.hasMove = true;
            this.score += currentCell.value;
            differenceDOM.classList.add("move-up");
            if (currentCell.value === 2048) {
              this.isWin = true;
              this.refreshScrore();
            }
          }

        }
      }
      m++;
    }


    this.commonArr.forEach(el => {
      el.isCombine = false;
    })
  }

  // //передвижение
  // this.cellsForMoving = this.commonArr.filter(el => el.save.x !== el.x || el.save.y !== el.y);
  // console.log(1);
  // this.cellsForMoving.forEach(cell => {
  //   cell.element.style.display = 'none';
  //   console.log(cell);
  //   //создаём элемент
  //   let previousX = cell.save.x;
  //   let previousY = cell.save.y;
  //   let previousValue = cell.value;
  //   const el = document.createElement("div");
  //   el.className = `cell t${previousValue}`;
  //   parentEl.appendChild(el);
  //   el.style.top = `${previousY * 100}px`;
  //   el.style.left = `${previousX * 100}px`;
  //   el.style.transitionProperty = 'top, left';
  //   el.style.transitionDuration = celltransition + 'ms';

  //   setTimeout(() => {
  //     el.style.top = cell.y * 100 + 'px';
  //     el.style.left = cell.x * 100 + 'px';
  //     console.log(el.style.top);

  //     if (el.style.top === cell.y * 100 && el.style.left === cell.x * 100) {
  //       cell.element.style.display = 'block';
  //       el.remove();
  //       cell.savePosition();
  //     }
  //   }, 0)




  //   setTimeout(() => {
  //     cell.element.style.display = 'block';
  //     el.remove();
  //   }, celltransition + 100)
  //   cell.savePosition();
  // })


  // console.log(this.cellsForMoving);





  /**
    *отвеччает за соединение клеток на игровом поле, если было соединение клеток то устанавливает this.hasMove = true, так же проверяет isWin и при соединении клеток обновляет счёт
  */
  combine(directionGrid) {
    for (let i = 0; i < this.size; i++) {
      for (let j = this.size - 1; j >= 1; j--) {
        let currentCell = directionGrid[i][j];
        let previousCell = directionGrid[i][j - 1];
        if (currentCell.value === previousCell.value && currentCell.value !== null && previousCell.value !== null) {
          previousCell.combineCells(currentCell)
          this.hasMove = true;
          this.score += currentCell.value;
          differenceDOM.classList.add("move-up");
          if (currentCell.value === 2048) {
            this.isWin = true;
            this.refreshScrore();
          }
        }
      }
    }
  }


  /**
    *перебирает массив в поисках повторяющихся клеток, необходимо для findIsGameOver()
    *@return {boolean}  возвращаем true если есть повторяющиеся клетки, иначе false
  */
  loopCellsIsLose(directionGrid) {
    for (let i = 0; i < this.size; i++) {
      for (let j = this.size - 1; j >= 1; j--) {
        let currentCell = directionGrid[i][j];
        let previousCell = directionGrid[i][j - 1];
        if (currentCell.value === previousCell.value) {
          return true
        }
      }
    }
  }

  /**
    *проверям проигрна игра или нет(игра проиграна в том случае если кол-во пустых клето 0 и в вертикальном и горизональном направлении рядом друг с другом нет повторяющихся клеток)
  */
  findIsGameOver() {
    this.findOpenCellsNumber();
    if (this.openSlots === 0) {
      if (!this.loopCellsIsLose(this.upDirectionGrid) && !this.loopCellsIsLose(this.rightDirectionGrid)) {
        this.isGameOver = true;
      }
    }
  }

  /**
   * убираем начальную заставку
  */
  closeHelloFrame() {
    document.querySelector('.hello').style.display = 'none';
    $(gameScoreDOM).fadeIn(scoreBlockFadeIn);
    gameScoreDOM.style.display = 'flex';
  }

  /**
    *добавляем карту в свободную ячейку
  */
  addCard() {
    const twoOrFour = Math.random() < 0.90 ? 2 : 4;
    let randomCell = this.findRandomOpenCell();
    randomCell.value = twoOrFour;
    randomCell.addClassAr(["appear", `t${twoOrFour}`]);
    randomCell.isOpen = false;
    this.hasMove = false;
  }


  /**
    *находим кол-во свободных клеток
    @return {number} число свободных клеток
  */
  findOpenCellsNumber() {
    this.updateOpenCellsArr()
    this.openSlots = this.openCellsArr.length;
  }

  /**
    *обновляем массив со свободными клетками
    @return {Array} массив со всеми свободными ячейками
  */
  updateOpenCellsArr() {
    this.openCellsArr = this.commonArr.filter(el => el.isOpen);
  }


  /**
    *находим рандомную клетку из числа свободных
    *@return {Object} возвращает свободную ячейку
  */
  findRandomOpenCell() {
    this.updateOpenCellsArr();
    this.findOpenCellsNumber();
    let randomCell = Math.floor(Math.random() * this.openSlots);
    return this.openCellsArr[randomCell];
  }


  /**
    *анимация выйгрыша и пройгрыша 
    * @param  {String} str фразы для анимации
  */
  animationWinLose(str) {
    $(gameScoreDOM).fadeOut(gameScoreFadeOut);
    this.flagWinOrLose = true;
    gameOverDOM.classList.add("fade-in");
    gameOverDOM.style.display = "inline";
    winOrLoseTitleDOM.innerHTML = str;
    setTimeout(() => {
      startAgainButtonDOM.addEventListener("click", function () {
        window.location.reload(); //при нажатии перезагрузит страницу, но только после 2000мс чтобы успела анимация проиграть
      });
    }, animationPhraseTimeOut);
  }
}

export default Grid;




//this.commonArr.forEach(el => el.save())
// console.log(this.rightDirectionGrid);

// for (let i = 0; i < this.size; i++) {
//   let m = 0;
//   while (m < this.size - 1) {
//     for (let j = 0; j < this.size - 1; j++) {
//       let currentCell = this.rightDirectionGrid[i][j];
//       let nextCell = this.rightDirectionGrid[i][j + 1];
//       if (!currentCell.isOpen && nextCell.isOpen) {
//         currentCell.updateIsOpen(nextCell);
//         this.hasMove = true;
//       }
//     }
//     m++;
//   }

// }
//console.log(this.commonArr)
// let moveArr = this.commonArr.filter(el => el.save && el.isOpen === false);
// console.log(moveArr);
// moveArr.forEach(el => {
//   let previousX = el.save.x;
//   let previousY = el.save.y;
//   el.move(this.rightDirectionGrid[previousY][previousX])
// })
// this.commonArr.forEach(el => el.save = null)








//передвижение
// let interval = setInterval(() => {
//   if (cell.x - elementForMove.x !== 0) {
//     elementForMove.element.style.left = parseInt(elementForMove.element.style.left)
//       + (cell.x - elementForMove.x > 0 ? 50 : -50) + 'px';
//     if (parseInt(elementForMove.element.style.left) === cell.x * 100) {
//       clearInterval(interval)
//     }
//   }
//   if (cell.y - elementForMove.y !== 0) {
//     elementForMove.element.style.top = parseInt(elementForMove.element.style.top)
//       + (cell.y - elementForMove.y > 0 ? 50 : -50) + 'px';
//     if (parseInt(elementForMove.element.style.top) === cell.y * 100) {
//       clearInterval(interval)
//     }
//   }
//   // elementForMove.element.style.left = cell.x * 100 + 'px';
//   // elementForMove.element.style.top = cell.y * 100 + 'px';
// }, 1000 / 30)
// elementForMove.element.style.left = cell.x * 100 + 'px';
// elementForMove.element.style.top = cell.y * 100 + 'px';
// setTimeout(() => {
//   console.log(3);

// elementForMove.element.style.transitionProperty = 'transform';
// elementForMove.element.style.transitionDuration = celltransition + 'ms';
//elementForMove.element.style.transform = `translate(${(cell.x - elementForMove.x) * 100}px, ${(cell.y - elementForMove.y) * 100}px)`;

// elementForMove.element.style.left = cell.x * 100 + 'px';
//   elementForMove.element.style.top = cell.y * 100 + 'px';
      // }, 80)

      // setTimeout(() => {
      //   console.log(4);
      //   cell.element.style.display = 'block';
      //   elementForMove.element.remove();
      // }, celltransition)
      // cell.savePosition();


      //   setTimeout(() => {
      //     cell.updateClass(this.rightDirectionGrid[previousY][previousX]);
      //     // cell.savePosition();
      //     console.log(this.rightDirectionGrid);
      //   }, 300)


      // cell.move(this.rightDirectionGrid[previousY][previousX]);
      //cell.updateClass(this.rightDirectionGrid[previousY][previousX]);