'use strict'

import React from 'react'

const DefaultOutputType = ({
  children,
  contextPath,
  deployment,
  CssLinks,
  Fusion,
  Libs,
  MetaTags
}) =>
  <html>
    <head>
      <title>Fusion Article</title> 
      <MetaTags />
      <Libs />
      <CssLinks />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
      <link rel='icon' type='image/x-icon' href={deployment(`${contextPath}/resources/favicon.ico`)} />
    </head>
    <body>
      <div id='fusion-app'>
        {children}
      </div>
      <Fusion />
    </body>
  </html>

DefaultOutputType.transform = {
  arcio({ context }) {
    const { props, contentCache } = context;

    return {
      contentType: 'application/json',
      data: {
        tree: props.tree,
        renderables: props.renderables,
        globalContent: props.globalContent,
        featureContent: Object.assign(
          {},
          ...Object.keys(contentCache)
            .map((sourceName) => {
              const sourceCache = contentCache[sourceName];
              return {
                [sourceName]: Object.assign(
                  {},
                  ...Object.keys(sourceCache)
                    .map((queryString) => {
                      return {
                        [queryString]: sourceCache[queryString] && sourceCache[queryString].filtered,
                      };
                    }),
                ),
              };
            }),
        ),
      },
    };
  },
};

export default DefaultOutputType