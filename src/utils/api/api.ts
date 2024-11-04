const API_URL = 'http://localhost:3001';
const HEADERS = {
  'Content-Type': 'application/json',
};

interface ApiRes<T> {
  status: number;
  data: T;
}

class Api {
  private _url: string;
  private _headers: Record<string, string>;

  constructor(url: string, headers: Record<string, string>) {
    this._url = url;
    this._headers = headers;
  }

  private _checkRes = <T>(res: Response): Promise<ApiRes<T>> => {
    const data = res.json();
    // @ts-ignore
    if (res.ok || res.status === 409) return { status: res.status, data };
    return Promise.reject(new Error(`[${res.status}:${res.statusText}]`));
  };

  getIpAdress() {
    return fetch(`${this._url}/ip`, {
      method: 'GET',
      headers: this._headers,
    })
      .then((res) => this._checkRes(res))
      .then((res) => res);
  }

  getAllGames() {
    return fetch(`${this._url}/games`, {
      method: 'GET',
      headers: this._headers,
    })
      .then((res) => this._checkRes(res))
      .then((res) => res);
  }

  getGame(ip: string) {
    return fetch(`${this._url}/games/${ip}`, {
      method: 'GET',
      headers: this._headers,
    })
      .then((res) => this._checkRes(res))
      .then((res) => res);
  }

  createGame() {
    return fetch(`${this._url}/games`, {
      method: 'POST',
      headers: this._headers,
    })
      .then((res) => {
        console.log('create Game res', res);
        return this._checkRes(res);
      })
      .then((res) => res);
  }

  updateGame({
    ipAdress,
    // history,
    isGameOver,
    isHistoryUsed,
    currentMove,
    winner,
    playerMoved,
    sections,
  }: any) {
    console.log('updateGame currentMove', currentMove);
    return fetch(`${this._url}/games/${ipAdress}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this._headers,
      },
      body: JSON.stringify({
        // history,
        isGameOver,
        isHistoryUsed,
        currentMove,
        winner,
        playerMoved,
        sections,
      }),
    })
      .then((res) => {
        console.log('updateGame res', res);
        return this._checkRes(res);
      })
      .then((res) => res);
  }
}

export const API = new Api(API_URL, HEADERS);
