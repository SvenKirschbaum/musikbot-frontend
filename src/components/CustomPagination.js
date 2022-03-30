import {Pagination} from "react-bootstrap";

import './CustomPagination.css';

export default function CustomPagination(props) {
    const {activePage, pages, onChange} = props;
    return (
        <Pagination>
            <Pagination.First onClick={() => onChange(1)}>First</Pagination.First>
            {(activePage - 2) >= 1 &&
                <Pagination.Item onClick={() => onChange(activePage - 2)}>{activePage - 2}</Pagination.Item>}
            {(activePage - 1) >= 1 &&
                <Pagination.Item onClick={() => onChange(activePage - 1)}>{activePage - 1}</Pagination.Item>}
            <Pagination.Item active>{activePage}</Pagination.Item>
            {(activePage + 1) <= pages &&
                <Pagination.Item onClick={() => onChange(activePage + 1)}>{activePage + 1}</Pagination.Item>}
            {(activePage + 2) <= pages &&
                <Pagination.Item onClick={() => onChange(activePage + 2)}>{activePage + 2}</Pagination.Item>}
            <Pagination.Last onClick={() => onChange(pages)}>Last</Pagination.Last>
        </Pagination>
    );
}