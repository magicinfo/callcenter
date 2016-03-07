var R_ListRow = React.createClass({
    componentDidMount: function() {
       // this.setState({clickEvent: event});
    },
    getInitialState: function () {
        return { touchid:-1 };
    },
    onTouchStart:function(evt){
        console.log(this.state);
        this.setState({touchid: evt.touches[0].identifier});
        console.log(evt.touches[0]);
    },
    render: function() {

        var name = this.props.product.name;



        return (
            <tr onTouchStart={this.onTouchStart}
                onTouchCancel={this.onTouchCancel}
                onTouchEnd={this.onTouchEnd}
                onTouchMove={this.onTouchMove}
            >
                <td>{this.props.product.icon}</td>
                <td>{this.props.product.id}</td>
                <td>{this.props.product.delay}</td>
            </tr>
        );
    }
});

var R_ListTable = React.createClass({

    callServer:function(){

    },
    render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
           // if (product.category !== lastCategory) {
            //rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
           // }
            rows.push(<R_ListRow product={product} key={product.name} />);
            lastCategory = product.category;
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});


var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(<R_ListTable products={PRODUCTS} />,document.getElementById('listtable'));