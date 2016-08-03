class ProtectedBranchEdit {
  constructor(options) {
    this.$wrap = options.$wrap;
    this.$allowedToMergeDropdown = this.$wrap.find('.js-allowed-to-merge');
    this.$allowedToPushDropdown = this.$wrap.find('.js-allowed-to-push');

    this.buildDropdowns();
  }

  buildDropdowns() {

    // Allowed to merge dropdown
    new ProtectedBranchesAccessDropdown({
      $dropdown: this.$allowedToMergeDropdown,
      data: gon.merge_access_levels,
      onSelect: this.onSelect.bind(this)
    });

    // Allowed to push dropdown
    new ProtectedBranchesAccessDropdown({
      $dropdown: this.$allowedToPushDropdown,
      data: gon.push_access_levels,
      onSelect: this.onSelect.bind(this)
    });
  }

  onSelect() {
    const $allowedToMergeInput = $(`input[name="${this.$allowedToMergeDropdown.data('fieldName')}"]`);
    const $allowedToPushInput = $(`input[name="${this.$allowedToPushDropdown.data('fieldName')}"]`);

    $.ajax({
      type: 'POST',
      url: this.$wrap.data('url'),
      dataType: 'json',
      data: {
        _method: 'PATCH',
        id: this.$wrap.data('banchId'),
        protected_branch: {
          merge_access_level_attributes: {
            access_level: $allowedToMergeInput.val()
          },
          push_access_level_attributes: {
            access_level: $allowedToPushInput.val()
          }
        }
      },
      success: () => {
        this.$wrap.effect('highlight');
      },
      error: function() {
        $.scrollTo(0);
        new Flash('Failed to update branch!');
      }
    });
  }
}

class ProtectedBranchEditList {
  constructor() {
    this.$wrap = $('.protected-branches-list');

    // Build edit forms
    this.$wrap.find('.js-protected-branch-edit-form').each((i, el) => {
      new ProtectedBranchEdit({
        $wrap: $(el)
      });
    });
  }
}
