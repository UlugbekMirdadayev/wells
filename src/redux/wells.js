import { createSlice } from '@reduxjs/toolkit';

const wellSlice = createSlice({
  name: 'wells',
  initialState: [
    {
      id: 'Namangan',
      level: '244 SM PASTDA',
      salting: '1EC25',
      temperature: '50C',
      location: 'https://maps.app.goo.gl/tmTKPTvz5Tjrn9Kx7'
    },
    {
      id: 'Andijon',
      level: '15 SM balandda',
      salting: '8EC28',
      temperature: '25C',
      location: 'https://maps.app.goo.gl/QjHKpTZKUcBc6G7b6'
    }
  ],
  reducers: {
    setWells(state, { payload }) {
      return payload;
    }
  }
});

export const { setWells } = wellSlice.actions;
export default wellSlice.reducer;
