import { FC, useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
// import "./index.css";

interface CardProps {
  inputTitle?: string;
}

interface Item {
  id: string;
  text: string;
}

const CardTwo: FC<CardProps> = (props) => {
  const [text, setText] = useState<string>("");
  const [item, setItem] = useState<Item[]>([]);
  const [otherItem, setOtherItem] = useState<Item[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const storedItem = localStorage.getItem("item");
    const storedOtherItem = localStorage.getItem("otherItem");
    if (storedItem) {
      setItem(JSON.parse(storedItem));
    }
    if (storedOtherItem) {
      setOtherItem(JSON.parse(storedOtherItem));
    }
  }, []);


  const handleClickBtn = () => {
    setItem((prevItems) => [...prevItems, { id: text, text: text }]);
    localStorage.setItem("items", JSON.stringify(item));
    localStorage.setItem("otherItem", JSON.stringify(otherItem));
    setText("");
  };

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClick = () => {
    setVisible(true);
  };

  const handleSpanClick = () => {
    setVisible(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return; 

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = reorder(item, source.index, destination.index);
      setItem(reorderedItems);
    } else {
      const movedItem = item[source.index];
      const newItems = [...item];
      newItems.splice(source.index, 1);
      setItem(newItems);

      setOtherItem((prevItems) => [...prevItems, movedItem]);
    }
  };

  const reorder = (list: Item[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="card-wrapper">
        <div className="card-title-top">
          <input
            className="input-title"
            type="text"
            defaultValue={props.inputTitle}
          />
          <span>...</span>
        </div>

        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {item.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="div-list"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <li className="text">{item.text}</li>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="otherDroppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ marginTop: "20px" }}
            >
              {otherItem.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="div-list"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <li className="text">{item.text}</li>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {visible ? (
          <div className="add-text">
            <div>
              <textarea
                value={text}
                onChange={handleChangeTextarea}
                name="text"
                id="text"
              ></textarea>
            </div>
            <div className="btn-add">
              <button onClick={handleClickBtn}>Add Card</button>
              <span onClick={handleSpanClick}>X</span>
            </div>
          </div>
        ) : (
          <div className="add-card">
            <div onClick={handleClick} className="add-new-card">
              <span>+</span>
              <p>Add a card</p>
            </div>
            <div className="add-img">
              <img
                width={15}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD5TplR7TPp-LQ4x_k14_Xv_gHgB_eeUB5K0DeuPqpCw&s"
                alt="img"
              />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default CardTwo;
