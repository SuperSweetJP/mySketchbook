# utils/html_post.py
from bs4 import BeautifulSoup, Tag

def wrap_all_markdown_imgs(html: str) -> str:
    """
    Wrap every <img> (or its <a> parent if the image is linked)
    with <div class="mdl-card__media">…</div>.
    Skips images that are already inside a .mdl-card__media container.
    """
    soup = BeautifulSoup(html, "html.parser")

    for img in soup.find_all("img"):
        # already wrapped?
        if img.find_parent(class_="mdl-card__media"):
            continue

        # if image is inside a link, we want: <div.mdl-card__media><a><img/></a></div>
        node_to_wrap: Tag = img.parent if img.parent and img.parent.name == "a" else img

        wrapper = soup.new_tag("div", **{"class": "mdl-card__media"})
        node_to_wrap.replace_with(wrapper)
        wrapper.append(node_to_wrap)

        # Optional: promote alt text to a caption
        # alt = img.get("alt")
        # if alt:
        #     figcap = soup.new_tag("div", **{"class": "mdl-card__caption"})
        #     figcap.string = alt
        #     wrapper.append(figcap)

    return str(soup)
