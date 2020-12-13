# Lab 17

Just like that, our site now supports AMP! Let's learn a little bit more about how output types work together. By default, the if fusion does not find a compatible version of the feature file to render like `amp.jsx`, it falls back to `default.jsx`. The steps below show you how to prevent it from falling back and instead prevent rendering that feature entirely.

1. We will be adding setting the fallback value on our amp output type. Review the api for output types here and especially the section regarding fallback. https://redirector.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/api/feature-pack/components/output-type.md

2. To make sure that the features without amp versions will not render, add `fallback = false` to the component.
```
AmpOutputType.fallback = false
```

3. `npx fusion rebuild` and features without an amp output type should no longer render.

## Next up: Lab 18