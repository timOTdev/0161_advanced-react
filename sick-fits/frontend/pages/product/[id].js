import SingleProduct from "../../components/SingleProduct";

export default function SingpleProductPage({ query }) {
    return <SingleProduct id={query.id} />;
}
