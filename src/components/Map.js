function EuropeMap(props) {
    function deleteHandler() {
        console.log(props.text)
    }
    return (
        <div>
            <button className="btn" onClick={deleteHandler}>{props.text}</button>
        </div>
    );
}

export default EuropeMap;
