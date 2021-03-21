import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Product from './Product'

// This is just a string.
const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY {
    allProducts {
      id
      name
      price
      description
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
`

export default function Products() {
    // Reactive querying.
    const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY);

    // Checks cases after the data returns.
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
      <div>
        <ProductsListStyles>
          {data.allProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </ProductsListStyles>
      </div>
    );
}
