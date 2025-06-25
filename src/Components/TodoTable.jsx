import React from 'react'
import TodoTableBody from './TodoTableBody'

const TodosTable = (props) => {
    return (
        <div className='todos-table'>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Last Update</th>
                        <th>Functions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.todos.length === 0 || props.todos[0] === undefined
                            ?
                            <>
                                {!props.showLoader
                                    ?
                                    <tr><td colSpan={6} className='noTodo_table bg-danger'>No todos to display</td></tr>
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={6}>
                                                {props.showLoader && <div className='loader'></div>}
                                            </td>
                                        </tr>
                                    </>
                                }
                            </>
                            :
                            props.todos.map((todo, index) => {
                                return (
                                    <TodoTableBody key={index} todo={todo} ReadingData={props.ReadingData} />
                                )
                            })
                    }
                </tbody>
            </table>
            {
                props.todos.length !== 0
                &&
                <div className="pagination">
                    <button
                        className='btn btn-success  nav-disabled'
                        onClick={() => {
                            props.changeCurrentPage(props.currentPage - 1)
                        }}
                        disabled={props.currentPage <= 0}
                        style={{ cursor: props.currentPage <= 0 ? "not-allowed" : "pointer" }}
                    >
                        Previous
                    </button>
                    {props.Pages.map((page, index) => {
                        return (
                            <button
                                key={index}
                                className={`btn btn-primary ${page === props.currentPage ? "active" : ""}`}
                                onClick={() => {
                                    props.changeCurrentPage(page)
                                }}
                            >
                                {page}
                            </button>
                        )
                    })
                    }
                    <button
                        className='btn btn-success'
                        onClick={() => {
                            props.changeCurrentPage(props.currentPage + 1)
                        }}
                    >
                        Next
                    </button>
                </div>
            }
        </div>
    )
}

export default TodosTable
