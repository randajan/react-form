# @randajan/react-form

> Basic react forms and fields

[![NPM](https://img.shields.io/npm/v/@randajan/react-form.svg)](https://www.npmjs.com/package/@randajan/react-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @randajan/react-form
```

## Usage

```jsx
import { ClassNames, Form, Input, Track, Switch, Field, Label, Pin } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

ClassNames.redefine({
  "on":"switch-on",
  "off":"switch-off"
})

function App() {

  return (
    <Form>
      <Field autoSize/>
      <Input/>
      <Track/>
      <Switch/>
      <Label>Text</Label>
      <Pin/>
    </Form>
  )
}
```

## License

MIT © [randajan](https://github.com/randajan)
