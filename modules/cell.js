/**
 * модуль, который описывает ячейку игрового поля
 * @module Cell
 */


/** @const {HTMLElement} parentEl родительский элемент для создания ячейки*/
const parentEl = document.getElementById("playfield");

/**Класс представляющий ячейку игрвоого поля */
class Cell {
  /**
  * создать ячейку на игровом поле
  * @param {number} y  координата y ячейки
  * @param {number} x  координата x ячейки
  * @param {boolean} isOpen  открыта ячейка или нет
  * @param {number} value  значение внутри ячейки 
  * @param {Array} classAr  массив всех классов
  * @param {Object} previousValue  объект который хранит предыдущие параметры(значения) ячейки
  * @param {HTMLElement} element  ячейка в DOM
  */
  constructor(y, x, isOpen, value) {
    this.y = y;
    this.x = x;
    this.isOpen = isOpen || true;
    this.value = value || null;
    this.classAr = ["cell"];
    this.previousValue = null;
    this.element = this.createCell();
    this.save = {
      x: this.x,
      y: this.y
    };
    this.shell;
  }

  /**
   * создает ячейку,задает классы, местоположение, вставляем в DOM
   * @return {HTMLElement} возвращает ячейку с классами, в определенном месте согласно координатам y,x 
  */
  createCell() {
    const el = document.createElement("div");
    el.className = `${this.classAr}`;
    parentEl.appendChild(el);
    el.style.top = `${this.y * 100}px`;
    el.style.left = `${this.x * 100}px`;
    return el;
  }


  /**
   * сохраняем текущие данные ячейки
   * @return {Object} возвращает объект который хранит предыдущие параметры(значения) ячейки
  */
  saveClass() {
    this.previousValue = { x: this.x, y: this.y, arr: this.classAr, isOpen: this.isOpen, value: this.value, save: this.save };
  }

  /**
   * добавляем классы ячейке
   * @param  {Array} передаем массив с необходимыми классами  
  */
  addClassAr() {
    const args = [...arguments];
    this.classAr = this.classAr.concat(...args);
    this.element.classList = this.classAr.join(' ');
  }


  /**
   * удаляем все классы кроме 'cell'
  */
  deleteClassAr() {
    this.classAr = ['cell']
    this.element.classList = this.classAr.join(' ');
  }

  /**
   * передаём все параметры 1 ячейки - другой
   * @param  {Object} ячейка от которой передаются параметры
  */
  updateIsOpen(nextCell) {
    this.saveClass();

    nextCell.classAr = this.previousValue.arr;
    nextCell.element.classList = nextCell.classAr.join(' ');
    nextCell.isOpen = this.previousValue.isOpen;
    nextCell.save = this.previousValue.save;
    this.value = nextCell.value;
    nextCell.value = this.previousValue.value;
    this.classAr = ['cell']
    this.element.classList = this.classAr.join(' ');
    this.isOpen = true;
    this.savePosition()
  }

  savePosition() {
    this.save = {
      x: this.x,
      y: this.y
    }
  }

  updateClass(oldPositionCell) {
    this.saveClass();

    this.element.style.top = this.y * 100 + 'px';
    this.element.style.left = this.x * 100 + 'px';
    // oldPositionCell.element.style.top = oldPositionCell.y * 100 + 'px';
    // oldPositionCell.element.style.left = oldPositionCell.x * 100 + 'px';
    // console.log(this.element.style.top, this.y, this.element.style.left, this.x);

    oldPositionCell.element.style.transform = 'initial';
    this.classAr = oldPositionCell.classAr;
    this.element.classList = this.classAr.join(' ');
    this.value = oldPositionCell.value;
    oldPositionCell.classAr = ['cell'];
    oldPositionCell.element.classList = oldPositionCell.classAr.join(' ');
    oldPositionCell.value = this.previousValue.value;
  }


  move(oldPositionCell) {
    this.saveClass();
    // this.element.style.top = oldPositionCell.y * 100 + 'px';
    // this.element.style.left = oldPositionCell.x * 100 + 'px';
    // oldPositionCell.element.style.transform = `translate(${(this.x - oldPositionCell.x) * 100}px, ${(this.y - oldPositionCell.y) * 100}px)`;
    oldPositionCell.element.style.left = this.previousValue.x * 100 + 'px';
    oldPositionCell.element.style.top = this.previousValue.y * 100 + 'px';
    // console.log(this, oldPositionCell);

  }
  /**
   *соединяем две ячейки
   *@param  {Object} ячейка с которой соединяем
  */
  combineCells(nextCell) {
    nextCell.value *= 2;
    this.value = null;
    this.isOpen = true;
    this.deleteClassAr();
    nextCell.deleteClassAr();
    nextCell.addClassAr(["pop", `t${nextCell.value}`])
  }

  /**
   *удаляем только 1 класс и обновляем classList  у элемента
  */
  deleteOneClass(classToDelete) {
    if (this.element.className.includes(classToDelete)) {
      let findIndex = this.classAr.indexOf(classToDelete)
      this.element.classList.remove(classToDelete);
      this.classAr.splice(findIndex, 1)
    }

  }
}

export default Cell;