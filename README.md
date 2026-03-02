# orma-ui

[![npm version](https://img.shields.io/npm/v/orma-ui.svg)](https://www.npmjs.com/package/orma-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/danielcjacks/orma-ui.svg)](https://github.com/danielcjacks/orma-ui/stargazers)

React UI components and functions for Orma, an ORM and query language. This library provides a schema-aware visual query builder for constructing complex database queries with ease.

`orma-ui` integrates deeply with MobX for state management and Material UI for a polished, responsive interface. It allows users to build nested queries, apply filters, and manage aggregations through an intuitive visual interface alongside a real-time JSON editor.

## Features

- **Schema-Aware Query Building**: Automatically detects entities, fields, and relationships from your OrmaSchema.
- **Visual Clause Construction**: Build complex `WHERE` and `HAVING` clauses with support for connectives ($and, $or) and operators ($eq, $gt, $in).
- **Relationship Navigation**: Follow foreign key relationships to build nested and related entity queries.
- **Advanced Query Support**: Includes support for `GROUP BY`, `ORDER BY`, field aliasing, and pagination ($limit, $offset).
- **Aggregate Functions**: Easily apply functions like `$count` to your data.
- **Integrated JSON Editor**: Real-time synchronization between the visual builder and a Monaco-based JSON editor.
- **Connected Entity Filtering**: Advanced filtering using `$where_connected` for complex relational logic.

## Installation

Install the package via npm:

```bash
npm install orma-ui
```

### Peer Dependencies

Ensure you have the following peer dependencies installed in your project:

- **React**: >=17.0.0
- **MobX**: >=6.0.0
- **MUI**: @mui/material >=5.0.0
- **Emotion**: @emotion/react >=11.0.0, @emotion/styled >=11.0.0
- **Orma**: >=1.0.267

## Quick Start

The primary component is the `QueryBuilder`. It requires an observable query object and your database schema.

```tsx
import React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { QueryBuilder } from 'orma-ui/src/query_builder/query_builder';

// Define your schema and an observable query object
const schema = { /* your OrmaSchema */ };
const state = makeAutoObservable({
  query: {}
});

const App = observer(() => {
  return (
    <div style={{ height: '600px' }}>
      <QueryBuilder 
        query={state.query} 
        orma_schema={schema} 
      />
    </div>
  );
});
```

## Components

### QueryBuilder

The `QueryBuilder` is a comprehensive interface for designing Orma queries. It provides a visual tree for selecting fields and entities, a dedicated section for clause management, and a side-by-side JSON editor for power users. 

It handles deep nesting, reverse nesting via foreign keys, and subqueries out of the box. Because the query object is observable, any changes made in the visual UI or the JSON editor are reflected across your application immediately.

## Development

To run the component stories locally and explore different query configurations, use the Ladle dev server:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The stories cover various use cases including basic field selection, deep nesting, complex filtering, and aggregate functions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
