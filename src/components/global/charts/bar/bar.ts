import { Chart, ChartType } from 'chart.js';
import {LitElement, html} from 'lit';
import { customElement } from 'lit/decorators';

@customElement('my-element')
export class MyElement extends LitElement {
  myChart: any;
  static override get properties() { 
    return { 
        Test: { type: String },
        myChart: { type: Object }
      };
    }

  constructor() {
    super();
  }

  override firstUpdated() {
    const canvas = <HTMLCanvasElement> document.getElementById('myChart2');
    const ctx = canvas.getContext('2d')  as unknown as CanvasRenderingContext2D;

    this.myChart = new Chart(ctx, {
        type: 'bar' as ChartType,
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
  }

  override render() {
    return html`
        <p>Inside Render:</p>
        <div>
          <canvas id="myChart2" width="400" height="400"></canvas>
        </div>
      `;
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'my-element': MyElement;
    }
  }  