(payload) => {
  const newRow = payload.new as { id: string };

  if (!newRow?.id) return;

  setListings((prev) =>
    prev.map((item) =>
      item.id === newRow.id ? newRow : item
    )
  );
}