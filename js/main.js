'use strict';

(() =>{
  class Reel{
    constructor(index){
      this.reels = document.querySelectorAll('.display > ul');
      this.count = 0;
      this.stopSwitch = false;

      this.patternImages = [
        'img/pattern01.png',
        'img/pattern02.png',
        'img/pattern03.png',
        'img/pattern04.png',
        'img/pattern05.png',
        'img/pattern06.png',
      ];

      this.defaultPatterns = [
        [4, 0, 2, 1, 5, 1, 3, 2, 5, 4],
        [1, 0, 5, 5, 3, 2, 4, 0, 3, 2],
        [2, 0, 3, 4, 1, 5, 3, 5, 0, 4],
      ];

      this.updatePatterns = [
        [4, 0, 2, 1, 5, 1, 3, 2, 5, 4],
        [1, 0, 5, 5, 3, 2, 4, 0, 3, 2],
        [2, 0, 3, 4, 1, 5, 3, 5, 0, 4],
      ];

      for(let i = 0; i < this.defaultPatterns[index].length; i++){
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = this.patternImages[this.defaultPatterns[index][i]];
        li.appendChild(img);
        this.reels[index].appendChild(li);
      }
    }

    spin(index){
      this.reels[index].style.transform += 'translateY(70px)';
      this.reels[index].style.transition = 'transform .2s linear';
      
      setTimeout(() =>{
        if(this.stopSwitch){
          game.patternCheck(index);

          if(game.stopCount === 3){
            game.result();
          }
  
          return;
        }
        
        if(this.count === 300){
          if(!game.quitSwitch){
            game.forceQuit();
          }

          return;
        }

        const currentPatterns = this.reels[index].childNodes;
        
        if(currentPatterns.length === this.count + this.defaultPatterns[index].length){
          const clone = currentPatterns[this.count].cloneNode(true);
          const number = this.updatePatterns[index][this.count];
          this.reels[index].appendChild(clone);
          this.updatePatterns[index].push(number);
        }
        
        this.count++;
        this.spin(index);
      }, 100);
    }

    format(index){
      this.reels[index].style.transition = 'none';
      this.reels[index].style.transform = 'translateY(0)';
      this.count = 0;
      this.stopSwitch = false;

      setTimeout(() =>{
        this.spin(index);
      }, 100);
    }

    stop(){
      this.stopSwitch = true;
    }
  }

  class Game{
    constructor(){
      this.betLamps = document.querySelectorAll('.bet-lamp > span');
      this.betCount = 0;
      this.betOrder = [2, 1, 3, 0, 4];

      this.stopCount = 0;
      this.bonusValue = 0;
      this.spinSwitch = false;
      this.quitSwitch = false;

      this.showPatterns = [
        [],
        [],
        [],
      ];

      this.gameOverDisplay = document.querySelector('.gameover');
    }

    format(){
      this.stopCount = 0;
      this.bonusValue = 0;
      this.quitSwitch = false;

      this.showPatterns = [
        [],
        [],
        [],
      ];
    }

    singleBet(){
      this.betLamps[this.betOrder[this.betCount]].classList.add('flush');
      this.betCount++;

      player.bet();
    }

    allBet(){
      do{
        this.singleBet();
      } while(player.currentCredit > 0 && game.betCount < 5);
    }

    stop(){
      this.stopCount++;
    }

    forceQuit(){
      alert('停止しました');
      this.quitSwitch = true;
      this.lampFormat();
    }

    patternCheck(index){
      this.showPatterns[index].push(reels[index].updatePatterns[index][reels[index].count + 1]);
      this.showPatterns[index].push(reels[index].updatePatterns[index][reels[index].count + 2]);
      this.showPatterns[index].push(reels[index].updatePatterns[index][reels[index].count + 3]);
    }

    result(){
      const topNumber = this.showPatterns[0][2];
      const middleNumber = this.showPatterns[0][1];
      const downNumber = this.showPatterns[0][0];

      switch(this.betCount){
        case 1:
          this.patternA(middleNumber);
          break;
        case 2:
          this.patternA(middleNumber);
          this.patternB(topNumber);
          break;
        case 3:
          this.patternA(middleNumber);
          this.patternB(topNumber);
          this.patternC(downNumber);
          break;
        case 4:
          this.patternA(middleNumber);
          this.patternB(topNumber);
          this.patternC(downNumber);
          this.patternD(topNumber);
          break;
        case 5:
          this.patternA(middleNumber);
          this.patternB(topNumber);
          this.patternC(downNumber);
          this.patternD(topNumber);
          this.patternE(downNumber);
          break;
      }

      if(this.bonusValue > 0){
        player.bonusGive(this.bonusValue);
      }

      this.lampFormat();
    }

    patternA(middle){
      if(middle === this.showPatterns[1][1] && middle === this.showPatterns[2][1]){
        this.bonusCheck(middle);
      }
    }

    patternB(top){
      if(top === this.showPatterns[1][2] && top === this.showPatterns[2][2]){
        this.bonusCheck(top);
      }
    }

    patternC(down){
      if(down === this.showPatterns[1][0] && down === this.showPatterns[2][0]){
        this.bonusCheck(down);
      }
    }

    patternD(top){
      if(top === this.showPatterns[1][1] && top === this.showPatterns[2][0]){
        this.bonusCheck(top);
      }
    }

    patternE(down){
      if(down === this.showPatterns[1][1] && down === this.showPatterns[2][2]){
        this.bonusCheck(down);
      }
    }

    bonusCheck(number){
      switch(number){
        case 0:
          this.bonusValue += 100;
          break;
        case 1:
          this.bonusValue += 50;
          break;
        case 2:
          this.bonusValue += 15;
          break;
        case 3:
          this.bonusValue += 10;
          break;
        case 4:
          this.bonusValue += 5;
          break;
        case 5:
          this.bonusValue += this.betCount;
          break;
      }
    }

    spinSwitchOn(){
      this.spinSwitch = true;
    }

    spinSwitchOff(){
      this.spinSwitch = false;
    }

    lampFormat(){
      this.betLamps.forEach(lamp =>{
        if(lamp.classList.contains('flush')){
          lamp.classList.remove('flush');
        }
      });
      this.betCount = 0;
      this.spinSwitchOff();

      if(player.currentCredit === 0){
        this.gameOver();
      }
    }

    gameOver(){
      this.gameOverDisplay.classList.remove('hidden');
    }
  }

  class Player{
    constructor(){
      this.credit = document.getElementById('credit');
      this.currentCredit = 30;

      this.bonus = document.getElementById('bonus');

      this.creditUpdate();
    }

    format(){
      this.bonus.textContent = '0';
    }

    bet(){
      this.currentCredit--;
      this.creditUpdate();
    }

    bonusGive(number){
      this.bonus.textContent = `${number}`;
      this.currentCredit += number;
      this.creditUpdate();
    }

    creditUpdate(){
      this.credit.textContent = `${this.currentCredit}`;
    }
  }

  const singleBtn = document.getElementById('single-bet-btn');
  const allBtn = document.getElementById('all-bet-btn');
  const spinBtn = document.getElementById('spin-btn');
  const stopBtns = document.querySelectorAll('.stop-btns > button');
  const payTable = document.querySelector('.pay-table');
  const payBtn = document.getElementById('pay-btn');

  const reels = [
    new Reel(0),
    new Reel(1),
    new Reel(2),
  ];

  const game = new Game();
  const player = new Player();

  singleBtn.addEventListener('click', () =>{
    if(game.betCount < 5 && !game.spinSwitch && player.currentCredit > 0){
      game.singleBet();
    }
  });

  allBtn.addEventListener('click', () =>{
    if(game.betCount < 5 && !game.spinSwitch && player.currentCredit > 0){
      game.allBet();
    }
  });

  spinBtn.addEventListener('click', () =>{
    if(game.betCount > 0 && !game.spinSwitch){
      game.spinSwitchOn();
      game.format();
      player.format();
  
      reels.forEach((reel, index) =>{
        reel.format(index);
      });
    }
  });

  stopBtns.forEach((stopBtn, index) =>{
    stopBtn.addEventListener('click', () =>{
      if(!reels[index].stopSwitch && game.spinSwitch){
        game.stop();
        reels[index].stop();
      }
    });
  });

  payBtn.addEventListener('click', () =>{
    payTable.classList.toggle('appear');
  });
})();