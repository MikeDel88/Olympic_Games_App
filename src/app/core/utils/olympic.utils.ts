import {Olympic, Olympics} from "../../models/olympic/olympic.model";
import {Participation} from "../../models/participation/participation.model";
import {CountryData} from "../../shared/components/medals-chart/interfaces/country-data.interface";


export function getTotalEntries(olympic: Olympic): number {
  return olympic.participations.length;
}

export function getYears(olympic: Olympic): number[] {
  return olympic.participations.map((participation: Participation) => participation.year);
}

export function getMedalsOlympic(olympic: Olympic): string[] {
  return olympic.participations.map((participation: Participation) => participation.medalsCount.toString());
}

export function getTotalMedals(olympic: Olympic): number {
  return getMedalsOlympic(olympic).reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
}

export function getNbreAthletes(olympic: Olympic): string[] {
  return olympic.participations.map((participation: Participation) => participation.athleteCount.toString());
}

export function getTotalAthletes(olympic: Olympic): number {
  return getNbreAthletes(olympic).reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
}

export function getTotalJOs(olympics: Olympics): number {
  return Array.from(new Set(olympics.map((olympic: Olympic) => olympic.participations.map((participation: Participation) => participation.year)).flat())).length;
}

export function getCountries(olympics: Olympics): CountryData[] {
  return olympics.map((olympic: Olympic) => ({
    id: olympic.id,
    name: olympic.country
  }));
}

export function getCountriesName(countries: CountryData[]): string[] {
  return countries.map(country => country.name)
}

export function getMedalsOlympics(olympics: Olympics): number[][] {
  return olympics
    .map((olympic: Olympic) => olympic.participations.map((participation: Participation) => (participation.medalsCount)));
}

export function sumOfAllMedalsYears(olympics: Olympics): number[] {
  return getMedalsOlympics(olympics)
    .map((items: number[]) => items.reduce((acc: number, i: number) => acc + i, 0));
}

export function sortByLeaders(a:Olympic, b: Olympic): 0 | 1 | -1 {
  const olympicA = getTotalMedals(a);
  const olympicB = getTotalMedals(b);
  return (olympicA > olympicB) ? -1 : (olympicA < olympicB) ? 1 : 0;
}
