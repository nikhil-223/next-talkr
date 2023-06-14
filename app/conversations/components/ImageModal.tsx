"use client";

import Modal from "@/app/components/modals/Modal";
import Image from "next/image";

interface ImageModalProps {
	isOpen?: boolean;
	onClose: () => void;
    image: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
	isOpen,
	onClose,
    image:messageImage
}) => {
	

	return (
        <div>
        </div>
	);
};

export default ImageModal;
