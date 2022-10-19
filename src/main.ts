import './style.css'
import { Manager } from './Manager';
import { LoaderScene } from './scenes/Loader';

// Inspired by https://www.pixijselementals.com/#advanced-loading
await Manager.initialize(0x222222);

const scene = new LoaderScene();
Manager.changeScene(scene);