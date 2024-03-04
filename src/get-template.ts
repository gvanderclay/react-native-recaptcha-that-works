/*
 * MIT License
 *
 * Copyright (c) 2020 Douglas Nassif Roma Junior
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export type RecaptchaSize = 'invisible' | 'normal' | 'compact';

export type RecaptchaTheme = 'dark' | 'light';

export type TemplateParams = {
  siteKey: string;
  size?: RecaptchaSize;
  theme?: RecaptchaTheme;
  lang?: string;
  action?: string;
};

const getTemplate = (
  params: TemplateParams,
  recaptchaDomain: string,
  gstaticDomain: string,
  enterprise: boolean,
  hideBadge: boolean,
) => {
  const {siteKey, theme, lang, size, action} = params;
  // const grecaptchaObject = enterprise
  //   ? 'window.grecaptcha.enterprise'
  //   : 'window.grecaptcha';

  // const jsScript = enterprise
  //   ? `<script async src="https://${recaptchaDomain}/recaptcha/enterprise.js?onload=renderRecaptcha&render=explicit"></script>`
  //   : `<script src="https://${recaptchaDomain}/recaptcha/api.js?hl={{lang}}&onload=onLoad"></script>`;
  const scriptUrl = enterprise
    ? `https://${recaptchaDomain}/recaptcha/enterprise.js?render=explicit`
    : `https://${recaptchaDomain}/recaptcha/api.js?render=explicit`;

  let template = `
    <!DOCTYPE html>
    <html lang="{{lang}}">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>

    
        <style>
            html,
            body,
            .container {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: transparent;
            }
    
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            ${hideBadge ? '.grecaptcha-badge { visibility: hidden; }' : ''}
        </style>
    </head>
    
    <body>
    <script>

    const action = "${action}";
    const siteKey = "${siteKey}";
    const scriptUrl = "${scriptUrl}";
    const size = "${size}";
    const theme = "${theme}";
    
    
    const onLoad = () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          load: [],
        })
      );
    };
    
    const onVerify = (token) => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          verify: [token],
        })
      );
    };
    
    const onExpire = (message) => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          expire: [message],
        })
      );
    };
    
    const onError = (error) => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          error: [error],
        })
      );
    };
    
    onExpire("initial script");

    let widget;

    const renderRecaptcha = function() {
      onExpire("renderRecaptcha1");
      const recaptchaParams = {
        sitekey: siteKey,
        size,
        theme,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onError,
      };
      onExpire("renderRecaptcha2");
      if (action) {
        recaptchaParams.action = action;
      }
      onExpire("renderRecaptcha3" + JSON.stringify(Object.keys(window.grecaptcha.enterprise)));
      window.grecaptcha.enterprise.ready(() => {
        onExpire("ready")
        const wrapper = document.createElement('div');
        onExpire("renderRecaptcha4");
        widget = window.grecaptcha.enterprise.render(wrapper, recaptchaParams);
        onExpire("renderRecaptcha5");
        document.querySelector('.container').appendChild(wrapper);
        onExpire("renderRecaptcha6");
        onLoad();
      });
    };
    
    
    onExpire("building script");
    const script = document.createElement('script');
    onExpire("created script" + JSON.stringify(script));
    onExpire(scriptUrl);
    script.src = scriptUrl;
    script.async = true;
    script.onload = renderRecaptcha;
    script.onerror = () => onError('Failed to load reCAPTCHA script');
    
    document.body.appendChild(script);
    onExpire("appended");
    
    window.rnRecaptcha = {
      execute: () => {
        onExpire("executing order 66")
        window.grecaptcha.enterprise.execute(widget);
        onExpire("well done")
      },
      reset: () => {
        window.grecaptcha.enterprise.reset(widget);
      },
    };
    
    onExpire("finished initial script")
            </script>
        <div class="container">
        </div>
    </body>
    
    </html>`;

  Object.entries(params).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'img'), value);
  });

  return template;
};

export default getTemplate;
