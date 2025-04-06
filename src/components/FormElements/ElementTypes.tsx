
import {
  Heading1,
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Clock,
  FileSignature,
  AlignLeft,
  AlignJustify,
  TextIcon,
  ChevronDown,
  CircleDot,
  CheckSquare,
  Image,
  Upload,
  Clock3,
  Bot,
  BarChart2,
  Table,
  Star,
  Ruler,
  DivideCircle,
  FolderClosed,
  SplitSquareVertical,
} from "lucide-react";
import { ElementIcon } from "./ElementIcon";

export interface FormElementType {
  name: string;
  icon: React.ReactNode;
  category: "basic" | "payments" | "widgets";
}

export const formElementTypes: FormElementType[] = [
  { name: "heading", icon: <ElementIcon icon={Heading1} />, category: "basic" },
  { name: "full_name", icon: <ElementIcon icon={User} />, category: "basic" },
  { name: "email", icon: <ElementIcon icon={Mail} />, category: "basic" },
  { name: "address", icon: <ElementIcon icon={MapPin} />, category: "basic" },
  { name: "phone", icon: <ElementIcon icon={Phone} />, category: "basic" },
  { name: "date_picker", icon: <ElementIcon icon={Calendar} />, category: "basic" },
  { name: "appointment", icon: <ElementIcon icon={Clock} />, category: "basic" },
  { name: "signature", icon: <ElementIcon icon={FileSignature} />, category: "basic" },
  { name: "short_text", icon: <ElementIcon icon={AlignLeft} />, category: "basic" },
  { name: "long_text", icon: <ElementIcon icon={AlignJustify} />, category: "basic" },
  { name: "paragraph", icon: <ElementIcon icon={TextIcon} />, category: "basic" },
  { name: "dropdown", icon: <ElementIcon icon={ChevronDown} />, category: "basic" },
  { name: "single_choice", icon: <ElementIcon icon={CircleDot} />, category: "basic" },
  { name: "multiple_choice", icon: <ElementIcon icon={CheckSquare} />, category: "basic" },
  { name: "image", icon: <ElementIcon icon={Image} />, category: "widgets" },
  { name: "file_upload", icon: <ElementIcon icon={Upload} />, category: "widgets" },
  { name: "time", icon: <ElementIcon icon={Clock3} />, category: "widgets" },
  { name: "captcha", icon: <ElementIcon icon={Bot} />, category: "widgets" },
  { name: "spinner", icon: <ElementIcon icon={BarChart2} />, category: "widgets" },
  { name: "input_table", icon: <ElementIcon icon={Table} />, category: "widgets" },
  { name: "star_rating", icon: <ElementIcon icon={Star} />, category: "widgets" },
  { name: "scale_rating", icon: <ElementIcon icon={Ruler} />, category: "widgets" },
  { name: "divider", icon: <ElementIcon icon={DivideCircle} />, category: "widgets" },
  { name: "section_collapse", icon: <ElementIcon icon={FolderClosed} />, category: "widgets" },
  { name: "page_break", icon: <ElementIcon icon={SplitSquareVertical} />, category: "widgets" },
];

export const getElementIcon = (type: string) => {
  const element = formElementTypes.find(el => el.name === type);
  return element ? element.icon : null;
};
