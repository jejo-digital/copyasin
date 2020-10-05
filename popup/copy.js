'use strict';

const copyTopParentButton = document.querySelector('#copyTopParent');

copyTopParentButton.value += TOP_ASINS_AMOUNT;


// copy ASINs as comma separated
document.querySelector('#copyCommaSeparated').addEventListener('click', function() {
  if (categoryAsins.length === 0) {
    showAlertDialog(Msg.ASIN_LIST_IS_EMPTY);
    return;
  }

  copyArrayToClipboard(categoryAsins, 'ASINs', ',');
});




// copy top parent ASINS
copyTopParentButton.addEventListener('click', async function() {
  try {
    const result = await obtainAndSaveBsrs();
    l('resolve', result);

    detectTopAsins();
    isNeedToClearTopAsins = false;
    copyArrayToClipboard(getParentTopAsins(), 'parent ASINs', EOL);
  }
  catch(err) {
    l('reject', err);

    if (err === Msg.CANCELLED_BY_USER) {
      return;
    }

    if (err !== Msg.ALL_BSRS_ALREADY_OBTAINED) {
      showAlertDialog(err);
      return;
    }
  }
});




// copy ASINs with BSRs
document.querySelector('#copyWithBsr').addEventListener('click', function() {
  if (categoryAsins.length === 0) {
    showAlertDialog(Msg.ASIN_LIST_IS_EMPTY);
    return;
  }

  const asinsWithBsrs = categoryAsins.map(function(asin) {
    let bsr = asins[asin].bsr;
    if (bsr === undefined) {
      // bsr obtaining was never performed
      bsr = '';
    }
    else if (bsr === null) {
      // bsr obtained, but was absent
      bsr = 'absent';
    }

    return asin + ',' + bsr;
  });

  copyArrayToClipboard(asinsWithBsrs, 'ASINs', EOL);
});




async function copyArrayToClipboard(array, itemName, separator) {
  l('copyArrayToClipboard()', array, itemName, JSON.stringify(separator).slice(1, -1));

  try {
    await navigator.clipboard.writeText(array.join(separator));

    showSuccessToast(`${array.length} ${itemName} copied.`);
  }
  catch(err) {
    showAlertDialog('Copy error: ' + err.message);
  }
}
