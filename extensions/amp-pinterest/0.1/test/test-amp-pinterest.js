/**
 * Copyright 2015 The AMP HTML Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    require('../../../../build/all/v0/amp-pinterest-0.1.max');
    import {adopt} from '../../../../src/runtime';
    import {Timer} from '../../../../src/timer';

    adopt(window);

    describe('amp-pinterest', () => {

      function createDivPromise() {
        return new Promise(function(resolve, reject) {
          var div = document.createElement('div');
          resolve({
            div: div,
            addElement: function(element) {
              div.appendChild(element);
              return new Timer(window).promise(16).then(() => {
                element.implementation_.layoutCallback();
                return element;
              });
            }
          });
          document.body.appendChild(div);
        });
      };

      function getPin(pinDo, pinUrl, pinMedia, pinDescription) {
        return createDivPromise().then(div => {
          var pin = document.createElement('amp-pinterest');
          pin.setAttribute('data-do', pinDo);
          pin.setAttribute('data-url', pinUrl);
          // force the guid to a known value so test will pass
          pin.setAttribute('data-volkswagen-guid', '8675309');
          pin.setAttribute('data-media', pinMedia);
          pin.setAttribute('data-description', pinDescription);
          return div.addElement(pin);
        });
      };

      it('renders', () => {
        return getPin('buttonPin',
          'http://www.flickr.com/photos/kentbrew/6851755809/',
          'http://c2.staticflickr.com/8/7027/6851755809_df5b2051c9_b.jpg',
          'Next stop: Pinterest'
        ).then(pin => {
          var a = pin.querySelector('a');
          expect(a).to.not.be.null;
          expect(a.tagName).to.equal('A');
          expect(a.href).to.equal('https://www.pinterest.com/pin/create/' +
            'button/?amp=1&guid=8675309&url=http%3A%2F%2Fwww.flickr.com%' +
            '2Fphotos%2Fkentbrew%2F6851755809%2F&media=http%3A%2F%2Fc2.s' +
            'taticflickr.com%2F8%2F7027%2F6851755809_df5b2051c9_b.jpg&de' +
            'scription=Next%20stop%3A%20Pinterest');
        });
      });

    });
