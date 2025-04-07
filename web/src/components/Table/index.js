import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;


const TableComponent = ({data, config, actions, content, loading, onrowclick}) => { 
    return (
        <Table 
            loading={loading}
            height={400}  
            data={data} 
            onRowClick={onrowclick} 
            rowHeight={50} 
            bordered={false} 
            cellBordered={false} 
            headerHeight={50}
        >
            {config.map((c) => (
                <Column flexGrow={!c.width ? 1 : 0} width={c.width} fixed={c.fixed}>
                    <HeaderCell>{c.label}</HeaderCell>
                    {!c.content ? <Cell dataKey={c.key}/> : <Cell>{(item) => c.content(item)}</Cell>}
                </Column>
            ))}
            <Column width={150} fixed="right">
                <HeaderCell>Ações</HeaderCell>
                <Cell>{(item) => actions(item)}</Cell>
            </Column>
        </Table>
    )
};

export default TableComponent;