import * as PIXI from 'pixi.js';
import ShipModel from './model/ship';
import ShipView from './view/ship';
import AirModel from './model/air';
import AirView from './view/air';
import BallModel from './model/ball';
import BallView from './view/ball';

import bg from '../res/background.png';

const CreateApp = PIXI.Application,
  Container = PIXI.Container,
  Sprite = PIXI.Sprite,
  Loader = PIXI.Loader;

const application = new CreateApp({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: window.devicePixelRatio || 1,
});

const container = new Container();
Loader.shared
  .add('bg', bg)
  .on('progress', loadProgressHandler)
  .load(setup);

application.stage.addChild(container);

function loadProgressHandler(loader, resource) {
  console.log('loading: ' + resource.url);
  console.log('progress: ' + loader.progress + '%');
}

function setup() {
  const texture = new Sprite(Loader.shared.resources.bg.texture);
  container.addChild(texture);
  document.body.appendChild(application.view);

  const enemy = [{ x: 10, y: 10 }, { x: 200, y: 10 }, { x: 400, y: 10 }, { x: 600, y: 10 }];

  const UPS = 50;

  const models = [];

  const startttmp = window.performance.now();

  let worldCounter = 0;

  setInterval(function() {
    const current = window.performance.now();
    const count = ((current - startttmp) * UPS) / 1000 - worldCounter;
    for (let i = 0; i < count; i++) {
      worldCounter++;
      models.map(model => model.update());
    }
  }, 10);

  models.push(new ShipModel());
  models.push(new BallModel({ x: container.width / 2, y: container.height / 2 }));

  function createModel(data) {
    return new AirModel(data);
  }

  models.push(...enemy.map(createModel));

  const views = [];

  function create(model) {
    if (model instanceof ShipModel) {
      return new ShipView(container, model);
    } else if (model instanceof AirModel) {
      return new AirView(container, model);
    } else if (model instanceof BallModel) {
      return new BallView(container, model);
    }
  }

  function render() {
    requestAnimationFrame(() => {
      models.map(model => {
        if (!views.some(view => view.model === model)) {
          views.push(create(model));
        }
      });

      views.map(view => view.render());
      render();
    });
  }

  requestAnimationFrame(render);
}
