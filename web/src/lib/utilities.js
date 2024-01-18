export const parseMentions = text => {
  let firstSplit = text.split('@[');
  let mentions = null;
  if (firstSplit.length) {
    firstSplit.forEach(part => {
      const secondSplit = part.split(']@@(user:');
      if (secondSplit.length === 2) {
        if (mentions === null) {
          mentions = {
            [secondSplit[1].substr(0, secondSplit[1].indexOf(')@'))]: true,
          };
        } else {
          mentions[
            secondSplit[1].substr(0, secondSplit[1].indexOf(')@'))
          ] = true;
        }
      }
    });
  }
  firstSplit = firstSplit.join('<span class="mentioned-user">@');
  firstSplit = firstSplit.split(']@').join('</span>');
  firstSplit = firstSplit
    .split('@(user:')
    .join('<span class="mentioned-user-id">');
  firstSplit = firstSplit.split(')@').join('</span>');
  return { mentions, text: firstSplit };
};

const dict = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

export const filterSongs = (title, artistName, filter = '') => {
  if (!title) return false;
  if (!filter) return true;

  const newTitle = title.toLowerCase().replace(/[^\w ]/g, char => {
    return dict[char] || char;
  });
  const matchTitle = newTitle.indexOf(filter.toLowerCase()) !== -1;
  const matchArtist =
    artistName
      .replace(/[^\w ]/g, char => {
        return dict[char] || char;
      })
      .toLowerCase()
      .indexOf(filter.toLowerCase()) !== -1;
  return matchTitle || matchArtist;
};

export const getPlayerBounds = musicProvider => {
  const isSquarePlayer =
    musicProvider === 'deezer' || musicProvider === 'spotify';
  let width = isSquarePlayer ? 450 : 640;
  let height = isSquarePlayer ? 450 : 390;
  if (window.innerWidth < 1200 && window.innerWidth > 992) {
    width = isSquarePlayer ? 435 : 530;
    height = isSquarePlayer ? 435 : 350;
  } else if (window.innerWidth < 992 && window.innerWidth > 490) {
    width = 490;
    height = 320;
  } else if (window.innerWidth < 490) {
    width = window.innerWidth - 10;
    height = 240;
  }
  return { width, height };
};

export const replaceAccents = string => {
  return string
    .replace(/[ÀÁÂÃÄÅ]/g, 'A')
    .replace(/[ÈÉÊË]/g, 'E')
    .replace(/[ÎÍ]/g, 'I')
    .replace(/[ÔÓ]/g, 'O')
    .replace(/[ÙÚ]/g, 'U')
    .replace(/[Ç]/g, 'C');
};

export const makeid = () => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';

  for (let i = 0; i < 21; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
