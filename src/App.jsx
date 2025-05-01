import { useState, useEffect } from "react";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

// Function to combine products with the same name and sum their revenue
const combineProducts = (arr) => {
  return Object.values(
    arr.reduce((acc, product) => {
      if (!acc[product.name]) {
        acc[product.name] = { ...product };
      } else {
        acc[product.name].revenue += product.revenue;
        acc[product.name].sold += product.sold; 
      }
      return acc;
    }, {})
  );
};

const totalRevenueSum = (arr) => {
  return arr.reduce((acc, item) => {
    return acc + item.revenue;
  }, 0);
};

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const branches = [1, 2, 3];
        const result = await Promise.all(
          branches.map((num) =>
            fetch(`/api/branch${num}.json`).then((res) => res.json())
          )
        );

        // Combine into one array
        const allProducts = result.reduce((acc, branch) => {
          return [...acc, ...branch.products];
        }, []);

        // Create new array with field for revenue that is the sum of unitPrice multiplied by sold
        const allProductsWithRevenue = allProducts.map((item) => ({
          ...item,
          revenue: item.unitPrice * item.sold,
        }));

        // Combine duplicates and alphabetically sort the products
        const combinedProducts = combineProducts(allProductsWithRevenue).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setData(combinedProducts);
        setFilteredData(combinedProducts);
        // Calculate total revenue;
        setTotalRevenue(formatNumber(totalRevenueSum(combinedProducts)));
      } catch (err) {
        setError(err);
      }
    }

    fetchBranches();
  }, []);

  // Update total revenue when filteredData changes after search
  useEffect(() => {
    setTotalRevenue(formatNumber(totalRevenueSum(filteredData)));
  }, [filteredData]);

  // Filter products based on search input
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filteredProducts = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filteredProducts);
  };

  if (error) return <div>Error: {error.message}</div>;
  if (!data.length) return <div>Loading...</div>;
  return (
    <div className="product-list">
      <label htmlFor="search-field">Search Products</label>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        id="search-field"
        placeholder="Search for a product"
      />

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{formatNumber(item.revenue)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{totalRevenue}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
