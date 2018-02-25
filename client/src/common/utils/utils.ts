import { json } from 'aurelia-fetch-client';

export const writeToLocalStorage = (key: string, data: any): void => {
  window.localStorage.setItem(key, json(data));
};

export const readFromLocalStorage = (key: string): any => {
  return JSON.parse(window.localStorage.getItem(key));
};
