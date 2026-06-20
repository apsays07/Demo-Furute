import React from "react";
import { render } from "@testing-library/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CloseIcon,
  PlayIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon,
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  UserIcon,
  BuildingIcon,
  BookOpenIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HelpingHandsIcon,
  TrophyIcon,
  CompassIcon,
  SmartWorkIcon,
  TargetIcon,
  UsersIcon,
  TrendingUpIcon,
  ZapIcon,
  CalendarIcon,
  ChartIcon,
  BasketIcon,
  MapIcon,
  MicIcon,
  TagIcon
} from "../ui/Icons";

describe("Icon Components", () => {
  const icons = [
    { name: "ArrowLeftIcon", comp: ArrowLeftIcon },
    { name: "ArrowRightIcon", comp: ArrowRightIcon },
    { name: "ArrowUpIcon", comp: ArrowUpIcon },
    { name: "CheckIcon", comp: CheckIcon },
    { name: "CloseIcon", comp: CloseIcon },
    { name: "PlayIcon", comp: PlayIcon },
    { name: "MailIcon", comp: MailIcon },
    { name: "PhoneIcon", comp: PhoneIcon },
    { name: "MapPinIcon", comp: MapPinIcon },
    { name: "ClockIcon", comp: ClockIcon },
    { name: "ChevronDownIcon", comp: ChevronDownIcon },
    { name: "FacebookIcon", comp: FacebookIcon },
    { name: "XIcon", comp: XIcon },
    { name: "LinkedInIcon", comp: LinkedInIcon },
    { name: "YouTubeIcon", comp: YouTubeIcon },
    { name: "UserIcon", comp: UserIcon },
    { name: "BuildingIcon", comp: BuildingIcon },
    { name: "BookOpenIcon", comp: BookOpenIcon },
    { name: "MessageSquareIcon", comp: MessageSquareIcon },
    { name: "ShieldCheckIcon", comp: ShieldCheckIcon },
    { name: "SparklesIcon", comp: SparklesIcon },
    { name: "HelpingHandsIcon", comp: HelpingHandsIcon },
    { name: "TrophyIcon", comp: TrophyIcon },
    { name: "CompassIcon", comp: CompassIcon },
    { name: "SmartWorkIcon", comp: SmartWorkIcon },
    { name: "TargetIcon", comp: TargetIcon },
    { name: "UsersIcon", comp: UsersIcon },
    { name: "TrendingUpIcon", comp: TrendingUpIcon },
    { name: "ZapIcon", comp: ZapIcon },
    { name: "CalendarIcon", comp: CalendarIcon },
    { name: "ChartIcon", comp: ChartIcon },
    { name: "BasketIcon", comp: BasketIcon },
    { name: "MapIcon", comp: MapIcon },
    { name: "MicIcon", comp: MicIcon },
    { name: "TagIcon", comp: TagIcon }
  ];

  icons.forEach(({ name, comp: Component }) => {
    it(`renders ${name} without crashing`, () => {
      const { container } = render(<Component className="test-class" style={{ color: "red" }} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("test-class");
      expect(svg.style.color).toBe("red");
    });
  });

  it("renders with stroke='none' to check strokeWidth branch", () => {
    const { container } = render(<ArrowLeftIcon stroke="none" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("stroke-width");
  });
});
