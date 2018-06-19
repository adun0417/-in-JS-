class BaseCharacter{
  constructor(name, hp, ap){
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage){
    if (this.alive == false) {
      return
    }
    character.getHurt(damage);
  }

  die(){
    this.alive = false;
  }


  getHurt(damage){
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }

    // _this 是用來暫時儲存 this，也就是這個物件本身
    // (先前的this因為setinterval用掉(代表window)，所以在這裡特別宣告另個this代表hero & monster)
    var _this = this;
    var i = 1;

    _this.id = setInterval(function() {
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i + '.png';
      i++;
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }

  updateHtml(hpElement, hurtElement){
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }

  heal(){
    this.hp += 30;
    this.hp > this.maxHp ? this.hp = this.maxHp : this.hp;
    this.updateHtml(this.hpElement, this.hurtElement);

    var i = 1;
    var _this = this;
    _this.id = setInterval(function() {
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healing");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "30";
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/'+ i + '.png';
      i++;
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healing");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }
}
class Hero extends BaseCharacter {
  constructor(name, hp, ap){
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
    console.log("召喚英雄 " + this.name + "!");
  }

  attack(character){
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}
class Monster extends BaseCharacter{
  constructor(name, hp, ap){
    super(name, hp, ap);
    console.log("遇到怪獸" + this.name + "!")

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
  }

  attack(character){
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character,Math.floor(damage));
  }

  getHurt(damage){
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

// 按鍵驅動: 攻擊發起
var skill = document.getElementById("skill");
skill.onclick = function(){
  heroAttack();
}

// 英雄和怪物攻擊時間軸
function heroAttack(){
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  // 英雄攻擊
  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  // 怪物攻擊
  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");

      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false){
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
     finish();
    }
  }, 1100);
}

var healSkill = document.getElementById("heal");
healSkill.onclick = function(){
  heroHeal();
}

function heroHeal(){
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  // 英雄自補
  setTimeout(function() {
    hero.element.classList.add("healing");
    setTimeout(function() {
      hero.heal();
      hero.element.classList.remove("healing");
    }, 500);
  }, 100);
  console.log("I need healing");

  // 怪物攻擊
  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");

      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false){
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
     finish();
    }
  }, 1100);
}

//  撰寫回合結束的機制
function endTurn(){
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1){
    finish();
  }
}

// 戰鬥結束畫面
function finish(){
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

var rounds = 10;
hero = new Hero("Bernard", 130, 30);
monster = new Monster("Skeleton", 130, 30);
