import { as_orma_schema } from "orma/src/introspector/introspector"

export const test_schema = as_orma_schema({
  products: {
    id: {
      data_type: "int",
      primary_key: true,
    },
    vendor_id: {
      data_type: "int",
      character_count: 5,
      decimal_places: 2,
      unsigned: true,
      references: {
        vendors: {
          id: {},
        },
      },
    },
    name: {
      character_count: 10,
      data_type: "varchar",
    },
    description: {
      data_type: "varchar",
    },
    status: {
      data_type: "enum",
      enum_values: ["published", "unpublished"],
    },
    $indexes: [],
  },
  vendors: {
    id: {
      primary_key: true,
    },
  },
  images: {
    id: {},
    product_id: {
      references: {
        products: {
          id: {},
        },
      },
    },
  },
  image_mirrors: {
    url: {
      data_type: "varchar",
    },
    image_id: {
      data_type: "int",
      not_null: true,
      references: {
        images: {
          id: {},
        },
      },
    },
  },
})
