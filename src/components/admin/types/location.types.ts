
export interface Country {
  _id: string;
  name: string;
  abrivation: string;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  _id: string;
  name: string;
  country: string | Country;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  _id: string;
  name: string;
  price: string;
  state: string | State;
  createdAt: string;
  updatedAt: string;
}

export interface LocationFormData {
  name: string;
  abrivation?: string;
  price?: string;
  country?: string;
  state?: string;
}
