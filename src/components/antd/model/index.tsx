import { Modal } from 'antd';
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import type { DraggableEvent, DraggableData } from 'react-draggable';

interface ModelWrapProps {
	open: boolean;
	okFunc: () => void;
	cancelFunc: () => void;
	contentComp: React.FC;
	okText?: string;
	cancelText?: string;
}

export const ModelWrap = (props: ModelWrapProps) => {
	const { open, cancelFunc, okFunc, contentComp: Content, okText = '保存', cancelText = '取消' } = props;
	const [disabled, setDisabled] = useState(true); // 是否禁用拖拽
	const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
	const draggleRef = useRef<HTMLDivElement>(null);

	const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
		const { clientWidth, clientHeight } = window.document.documentElement;
		const targetRect = draggleRef.current?.getBoundingClientRect();
		if (!targetRect) {
			return;
		}
		setBounds({
			left: -targetRect.left + uiData.x,
			right: clientWidth - (targetRect.right - uiData.x),
			top: -targetRect.top + uiData.y,
			bottom: clientHeight - (targetRect.bottom - uiData.y)
		});
	};

	return (
		<Modal
			title={
				<div
					style={{
						width: '100%',
						cursor: 'move'
					}}
					onMouseOver={() => {
						if (disabled) {
							setDisabled(false);
						}
					}}
					onMouseOut={() => {
						setDisabled(true);
					}}
				>
					信息编辑
				</div>
			}
			open={open}
			onOk={okFunc}
      okText={okText}
			onCancel={cancelFunc}
      cancelText={cancelText}
			modalRender={(modal) => (
				<Draggable
					disabled={disabled}
					bounds={bounds}
					nodeRef={draggleRef}
					onStart={(event, uiData) => onStart(event, uiData)}
				>
					<div ref={draggleRef}>{modal}</div>
				</Draggable>
			)}
		>
			<Content></Content>
		</Modal>
	);
};
