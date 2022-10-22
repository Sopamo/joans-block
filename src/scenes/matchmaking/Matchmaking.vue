<template>
  <div class="s-wrapper">
    <h1><span class="blue">Match</span>making</h1>
    <div class="s-start">
      <button @click="createMatch" class="button"><div class="button-line"></div>create <span class="blue">match</span></button>
    </div>
    <div class="s-join">
      <input v-model="matchId" type="text" class="input" placeholder="Match ID" /><br />
      <button @click="joinMatch" :disabled="matchId === ''" class="button"><div class="button-line"></div>join <span class="blue">match</span></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Manager } from '../../Manager';
import { Sync } from '../../multiplayer/Sync';
import { GameScene } from '../Game';

const matchId = ref("")

const createMatch = async () => {
  await Sync.startMatch()
  Manager.changeScene(new GameScene());
}

const joinMatch = async () => {
  await Sync.joinMatch(matchId.value)
  Manager.changeScene(new GameScene());
}

</script>

<style lang="scss" scoped>
.s-wrapper {
  padding: 100px 50px 0 50px;
}
.blue {
  color: #a1a8e0;
  text-shadow: rgba(161,168,224,0.4) 0px 0px 78px;
}
h1 {
  font-family: 'Silkscreen';
  text-align: center;
  font-weight: normal;
  color: white;
  margin-bottom: 50px;
}

.s-join, .s-start {
  text-align: center;
  margin-bottom: 150px;
}

.input {
  position: relative;
  border: solid 1px rgba(161,168,224,0.4);
  background: none;
  color: rgba(200, 204, 233, 0.496);
  font-family: 'Silkscreen';
  font-weight: normal;
  min-width: 200px;
  line-height: 30px;
  padding: 0;
  outline: none;
  text-indent: 10px;
  margin-bottom: 10px;
}

.button {
    position: relative;
    border: solid 1px rgba(161,168,224,0.4);
    background: none;
    color: rgba(200, 204, 233, 0.496);
    text-transform: uppercase;
    font-family: 'Silkscreen';
    font-weight: normal;
    letter-spacing: 2.8px;
    min-width: 200px;
    line-height: 60px;
    padding: 0;
    transition: all 0.25s ease;
    outline: none;
    cursor: pointer;

    &:disabled {
      filter: grayscale(1);
      cursor: default;
      opacity: 0.5;
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 80%;
      width: 20%;
      height: 1px;
      transform: translateY(-1px);
      background: rgba(0, 214, 252, 1);
      transition: all 0.25s ease;
    }
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      right: 10%;
      width: 90%;
      height: 1px;
      transform: translateY(1px);
      background: rgba(0, 214, 252, 1);
      transition: all 0.25s ease;
      transition-delay: 50ms;
    }
    &:not(:disabled):hover {
      box-shadow: 1px 1px 8px rgba(0, 214, 252, 0.3);
      color: rgba(0, 214, 252, 1);
      text-shadow: 0 0 8px rgba(0, 214, 252, 0.4);
      &.button:before {
        left: 0;
        width: 20px;
      }
      &.button:after {
        right: 0;
        width: 20px;
      }
      .button-line:before {
        bottom: 0;
      }
      .button-line:after {
        top: 0;
      }
    }
  &-line {
    &:before {
      content: "";
      position: absolute;
      bottom: 80%;
      right: 0;
      width: 1px;
      height: 20%;
      transform: translateX(1px);
      background: rgba(0, 214, 252, 1);
      transition: all 0.25s ease;
      transition-delay: 100ms;
    }
    &:after {
      content: "";
      position: absolute;
      top: 80%;
      left: 0;
      width: 1px;
      height: 20%;
      transform: translateX(-1px);
      background: rgba(0, 214, 252, 1);
      transition: all 0.25s ease;
      transition-delay: 150ms;
    }
  }
}

</style>