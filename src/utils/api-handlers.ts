import { API } from './api/api';
import _ from 'lodash';
import { GameState } from '../components/App/App';

interface Data {
  message?: string;
  game?: GameState;
}

export const initialGame = async (
  updateStorage: (storage: GameState) => void
) => {
  console.log('initialGame start');
  try {
    const res = await API.createGame();
    const data = (await res.data) as Data;

    console.log('initialGame game', data);
    if (data && data.game) {
      const { ipAdress } = data.game;
      switch (res.status) {
        case 200:
          console.log('New game session created successfully', res);
          break;
        case 409: {
          console.log(`Game session with IP ${ipAdress} already exists`);
          ipAdress && (await loadExistingGame(ipAdress, updateStorage));
        }
        default:
          console.log('Res status:', res.status);
      }
    }
  } catch (err) {
    err instanceof Error &&
      console.error('[initialGame] something goes wrong:', err.message);
  }
};

export const loadExistingGame = async (
  ip: string,
  updateStorage: (storage: GameState) => void
) => {
  console.log('loadExistingGame start');
  try {
    const res = await API.getGame(ip);
    const data = (await res.data) as Data;

    const updatedStorage = _.omit(data, ['createdAt', 'updatedAt']);
    if (data) {
      console.log('Loaded State', data);
      updateStorage(updatedStorage as GameState);
    }
  } catch (err) {
    err instanceof Error &&
      console.error('[loadExistingGame] something goes wrong:', err.message);
  }
};

export const updateCurrentGame = async (state: GameState) => {
  console.log('updateCurrenGame start');
  console.log('state', state);
  try {
    const res = await API.updateGame(state);
    const data = await res.data;
    console.log('updateCurrenGame data', data);
  } catch (err) {
    err instanceof Error &&
      console.error('[updateCurrentGame] something goes wrong:', err.message);
  }
};

export const getCurrentIp = async () => {
  try {
    const res = await API.getIpAdress();
    const data = (await res.data) as { currentIpAdress: string };
    const { currentIpAdress } = data;

    return currentIpAdress;
  } catch (err) {
    err instanceof Error &&
      console.error('[getCurrentIp] something goes wrong:', err.message);
  }
};
