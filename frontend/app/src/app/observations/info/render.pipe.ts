import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'joinDetails' })
export class JoinDetailsPipe implements PipeTransform {

    /**
     * Renders an array of descriptions for an observation detail.
     *
     * @param {Array<{ code: number, description: string }>} input - The array.
     * @return {string} The rendered string.
     */
    transform(input: Array<{ code: number, description: string }>): string {

        let str = "";

        input.forEach(v => str += `${ v.description }, `);

        return str.substring(0, str.length - 2);

    }

}
