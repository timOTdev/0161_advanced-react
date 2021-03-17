import Header from "./Header";

export default function Page({ children }) {
    return <div>
        <Header></Header>
        <h2>Page.js</h2>
        {children}
    </div>
}

