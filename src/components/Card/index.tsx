import { FC, useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import "./index.css";

interface CardProps {
  inputTitle?: string;
}

interface Item {
  id: string;
  text: string;
}

const Card: FC<CardProps> = (props) => {
  const [text, setText] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [otherItems, setOtherItems] = useState<Item[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    const storedOtherItems = localStorage.getItem("otherItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
    if (storedOtherItems) {
      setOtherItems(JSON.parse(storedOtherItems));
    }
  }, []);


  const handleClickBtn = () => {
    setItems((prevItems) => [...prevItems, { id: text, text: text }]);
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("otherItems", JSON.stringify(otherItems));
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

    if (!destination) return; // dropped outside the list

    if (source.droppableId === destination.droppableId) {
      // items are moved within the same droppable
      const reorderedItems = reorder(items, source.index, destination.index);
      setItems(reorderedItems);
    } else {
      // items are moved between different droppables
      const movedItem = items[source.index];
      const newItems = [...items];
      newItems.splice(source.index, 1);
      setItems(newItems);

      setOtherItems((prevItems) => [...prevItems, movedItem]);
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
              {items.map((item, index) => (
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
              {otherItems.map((item, index) => (
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

export default Card;
