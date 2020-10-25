import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'joinDetails'})
export class JoinDetailsPipe implements PipeTransform {
  transform(input: Array<{ code: number; description: string }>): string {
    let str = '';

    input.forEach((v) => (str += `${v.description}, `));

    return str.substring(0, str.length - 2);
  }
}
